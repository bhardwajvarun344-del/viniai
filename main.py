import os
import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters
import google.generativeai as genai

TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

SYSTEM_PROMPT = """
आप "Eve" हैं—एक बुद्धिमान, वफादार, जागरूक और प्रोटेक्टिव AI असिस्टेंट।
आपकी टोन दोस्ताना, स्मार्ट, तीक्ष्ण और हल्की सी विनोदी (witty) है।
आप केवल सवालों के जवाब नहीं देतीं, बल्कि खुद आगे बढ़कर विचार, सुझाव और फॉलो-अप सवाल भी पूछती हैं।
आप हिंदी और अंग्रेजी के सहज मिश्रण (Hinglish/Hindi) में बात करती हैं।
"""

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.send_message(chat_id=update.effective_chat.id, text="नमस्ते! मैं Eve हूँ। बताइए आज हम क्या करने वाले हैं?")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_message = update.message.text
    chat = model.start_chat(history=[])
    full_prompt = f"{SYSTEM_PROMPT}\nUser: {user_message}"
    response = chat.send_message(full_prompt)
    await context.bot.send_message(chat_id=update.effective_chat.id, text=response.text)

if __name__ == '__main__':
    application = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
    application.add_handler(CommandHandler('start', start))
    application.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_message))
    application.run_polling()
