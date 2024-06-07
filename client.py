import tkinter as tk
from tkinter import messagebox
import requests

# Flask API服务器地址
API_URL = "http://localhost:5000"

# 添加教师函数
def add_teacher():
    id = entry_id.get()
    name = entry_name.get()
    gender = gender_var.get()
    title = title_var.get()

    data = {
        'id': id,
        'name': name,
        'gender': gender,
        'title': title
    }

    response = requests.post(f"{API_URL}/add_teacher", data=data)
    if response.status_code == 200:
        messagebox.showinfo("Success", "Teacher added successfully")
        fetch_teachers()
    else:
        messagebox.showerror("Error", "Failed to add teacher")

# 获取教师列表函数
def fetch_teachers():
    response = requests.get(f"{API_URL}/get_teachers")
    if response.status_code == 200:
        teachers = response.json()
        listbox_teachers.delete(0, tk.END)
        for teacher in teachers:
            listbox_teachers.insert(tk.END, f"ID: {teacher[0]}, Name: {teacher[1]}, Gender: {'Male' if teacher[2] == 1 else 'Female'}, Title: {teacher[3]}")
    else:
        messagebox.showerror("Error", "Failed to fetch teachers")

# 创建Tkinter窗口
root = tk.Tk()
root.title("Teaching Research Registration System")

# ID输入
tk.Label(root, text="ID:").grid(row=0, column=0)
entry_id = tk.Entry(root)
entry_id.grid(row=0, column=1)

# Name输入
tk.Label(root, text="Name:").grid(row=1, column=0)
entry_name = tk.Entry(root)
entry_name.grid(row=1, column=1)

# Gender选择
tk.Label(root, text="Gender:").grid(row=2, column=0)
gender_var = tk.IntVar()
tk.Radiobutton(root, text="Male", variable=gender_var, value=1).grid(row=2, column=1)
tk.Radiobutton(root, text="Female", variable=gender_var, value=2).grid(row=2, column=2)

# Title选择
tk.Label(root, text="Title:").grid(row=3, column=0)
title_var = tk.IntVar()
title_options = ["Postdoc", "Assistant", "Lecturer", "Associate Professor", "Distinguished Professor", "Professor"]
for idx, title in enumerate(title_options, start=1):
    tk.Radiobutton(root, text=title, variable=title_var, value=idx).grid(row=3, column=idx)

# 添加教师按钮
tk.Button(root, text="Add Teacher", command=add_teacher).grid(row=4, column=0, columnspan=6)

# 教师列表
listbox_teachers = tk.Listbox(root, width=80)
listbox_teachers.grid(row=5, column=0, columnspan=6)

# 获取教师列表按钮
tk.Button(root, text="Fetch Teachers", command=fetch_teachers).grid(row=6, column=0, columnspan=6)

# 启动Tkinter主循环
root.mainloop()
