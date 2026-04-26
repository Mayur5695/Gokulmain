import streamlit as st
import pandas as pd
import sqlite3
from datetime import datetime
import locale

# Page Config
st.set_page_config(page_title="Gokul Snacks Tracker", page_icon="📦", layout="wide")

# Theme / CSS
st.markdown("""
    <style>
    .main {
        background-color: #1A0A00;
        color: #FFE8C8;
    }
    .stButton>button {
        background-color: #FF6B00;
        color: white;
        border-radius: 10px;
    }
    .metric-card {
        background-color: #2A1500;
        padding: 20px;
        border-radius: 15px;
        border: 1px solid #3D2000;
    }
    </style>
    """, unsafe_allow_html=True)

# Database Setup
def init_db():
    conn = sqlite3.connect('gokul_snacks.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS expenses 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, category TEXT, amount REAL, paid_by TEXT, notes TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS fixed_expenses 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount REAL, day_of_month INTEGER, notes TEXT)''')
    conn.commit()
    conn.close()

init_db()

def get_connection():
    return sqlite3.connect('gokul_snacks.db')

# Constants
CATEGORIES = {
    'warehouse': 'Warehouse Deposit',
    'rent': 'Rent (दरमहा)',
    'vehicle': 'Vehicle / Petrol',
    'banner': 'Banner / Marketing',
    'advance': 'Dealership Advance',
    'inventory': 'Inventory / Material',
    'transport': 'Transport / Delivery',
    'misc': 'Miscellaneous'
}
PARTNERS = ['Mayur', 'Suhail', 'Rahul', 'Common']

# Sidebar / Navigation
st.sidebar.title("Gokul Snacks")
st.sidebar.image("https://via.placeholder.com/150x150.png?text=GS", width=100)
menu = st.sidebar.radio("मुख्य मेनू", ["खर्च नोंद", "सर्व खर्च", "Fixed खर्च", "सारांश"])

# Header
st.title("Snacks Dealership Tracker")

if menu == "खर्च नोंद":
    st.subheader("➕ नवीन खर्च नोंदवा")
    with st.form("expense_form"):
        col1, col2 = st.columns(2)
        with col1:
            date = st.date_input("खर्चाची तारीख", datetime.now())
            category = st.selectbox("खर्चाचा प्रकार", list(CATEGORIES.values()))
        with col2:
            amount = st.number_input("रक्कम (₹)", min_value=0.0, step=0.01)
            paid_by = st.selectbox("कोणी दिले (Partner)", PARTNERS)
        
        notes = st.text_area("तपशील / नोट्स")
        submit = st.form_submit_button("✅ खर्च नोंदवा")
        
        if submit:
            if amount > 0:
                conn = get_connection()
                c = conn.cursor()
                c.execute("INSERT INTO expenses (date, category, amount, paid_by, notes) VALUES (?, ?, ?, ?, ?)",
                          (date.strftime('%Y-%m-%d'), category, amount, paid_by, notes))
                conn.commit()
                conn.close()
                st.success("✅ खर्च यशस्वीरित्या नोंदवला!")
            else:
                st.error("कृपया रक्कम भरा!")

elif menu == "सर्व खर्च":
    st.subheader("📋 खर्चाची यादी")
    conn = get_connection()
    df = pd.read_sql_query("SELECT * FROM expenses ORDER BY date DESC", conn)
    conn.close()
    
    if not df.empty:
        st.dataframe(df, use_container_width=True)
    else:
        st.info("अजून कोणताही खर्च नोंदवला नाही.")

elif menu == "Fixed खर्च":
    st.subheader("🏠 Monthly Fixed खर्च")
    with st.form("fixed_form"):
        col1, col2, col3 = st.columns(3)
        name = col1.text_input("खर्चाचे नाव")
        f_amount = col2.number_input("रक्कम (₹)", min_value=0.0)
        f_day = col3.number_input("तारीख (1-28)", min_value=1, max_value=28)
        f_submit = st.form_submit_button("➕ Fixed खर्च जोडा")
        
        if f_submit:
            conn = get_connection()
            c = conn.cursor()
            c.execute("INSERT INTO fixed_expenses (name, amount, day_of_month) VALUES (?, ?, ?)",
                      (name, f_amount, f_day))
            conn.commit()
            conn.close()
            st.success("Fixed खर्च जोडला!")

elif menu == "सारांश":
    st.subheader("📊 आर्थिक सारांश")
    conn = get_connection()
    df = pd.read_sql_query("SELECT * FROM expenses", conn)
    fixed_df = pd.read_sql_query("SELECT * FROM fixed_expenses", conn)
    conn.close()
    
    if not df.empty:
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.strftime('%B %Y')
        
        total_all = df['amount'].sum()
        current_month = datetime.now().strftime('%B %Y')
        total_month = df[df['month'] == current_month]['amount'].sum()
        
        col1, col2, col3 = st.columns(3)
        col1.metric("एकूण खर्च", f"₹{total_all:,.2f}")
        col2.metric("या महिन्यातील", f"₹{total_month:,.2f}")
        col3.metric("Fixed (Monthly)", f"₹{fixed_df['amount'].sum():,.2f}")
        
        st.write("---")
        st.write("### महिनावार खर्च")
        monthly_summary = df.groupby('month')['amount'].sum().sort_index(ascending=False)
        st.bar_chart(monthly_summary)
    else:
        st.info("सारांश पाहण्यासाठी आधी खर्च नोंदवा.")
