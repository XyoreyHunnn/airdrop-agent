


import os
import json
import requests
from bs4 import BeautifulSoup
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# --- KONFIGURÁCIÓ ---
TOKEN = "8068589794:AAEKtRFRWqxGWkQrdgfKwbzSqTogbZcVXgc"
PPLX_API_KEY = "nincs" # Cseréld le a valódi kulcsodra!

RULES_FILE = "rules.json"
PROJECTS_FILE = "projects.json"

# --- ADATKEZELÉS ---
def load_data(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_data(file_path, data):
    existing_data = load_data(file_path)
    existing_data.append(data)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=4, ensure_ascii=False)

# --- FUNKCIÓK ---
async def analyze_webpage(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        keywords = ["connect", "wallet", "claim", "airdrop", "join", "faucet", "testnet"]
        found_tasks = []
        
        for element in soup.find_all(['button', 'a']):
            text = element.get_text().strip().lower()
            if any(word in text for word in keywords):
                found_tasks.append(text.capitalize())
        
        return list(set(found_tasks))
    except Exception as e:
        return [f"Hiba az elemzéskor: {str(e)}"]

# --- PARANCSOK ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🤖 Szia! Én vagyok az Airdrop Ágensed.\n\nParancsok:\n/search - Keresés\n/list - Mentett projektek\nLink küldése - Web elemzés\nBármilyen szöveg - Szabály tanítása")

async def list_projects(update: Update, context: ContextTypes.DEFAULT_TYPE):
    projects = load_data(PROJECTS_FILE)
    if not projects:
        await update.message.reply_text("Még nincsenek mentett projektek.")
        return

