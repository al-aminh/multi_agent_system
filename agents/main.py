import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage


load_dotenv()

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.7,
    reasoning_format="hidden"
)

messages = [
    SystemMessage(content= "You are a helpful assistant. Answer the user's questions as best as you can."),

]

print("Welcome to the LangChain Groq Chatbot! Type 'exit' to quit.")

while True:
    user_input = input("You: ")
    if user_input.lower() in ['exit', 'quit']:
        print("Exiting the chatbot. Goodbye!")
        break
    messages.append(HumanMessage(content=user_input))
    try:
        response = llm.invoke(messages)
        print(f"AI: {response.content}")
        messages.append(AIMessage(content=response.content))

    except Exception as e:
        print(f"An error occurred: {e}")
        messages.pop()
        