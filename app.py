from flask import Flask, request, jsonify, render_template
from flask_mysqldb import MySQL
import mysql.connector
import MySQLdb
import pymysql

app = Flask(__name__)

# MySQL配置
app.config['MYSQL_HOST'] = '127.0.0.1@3306'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '040413'
app.config['MYSQL_DB'] = 'teaching_research'

mysql = MySQL(app)

con = MySQLdb.connect(
    host='localhost',
    user='root',
    password='040413',
    database='teaching_research'
)

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/index')
def index1():
    return render_template('index.html')

@app.route('/query')
def query():
    return render_template('query.html')

@app.route('/add_teacher', methods=['POST'])
def add_teacher():
    name = request.form['name']
    gender = int(request.form['gender'])
    title = int(request.form['title'])
    #cur = mysql.connection.cursor()
    cur = con.cursor()
    cur.execute("INSERT INTO teachers (name, gender, title) VALUES (%s, %s, %s)", (name, gender, title))
    #mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Teacher added successfully'}), 200

@app.route('/add_courses', methods=['POST'])
def add_courses():
    id1 = int(request.form['id'])
    name = request.form['name']
    hours = int(request.form['hours'])
    type1 = int(request.form['type'])
    #cur = mysql.connection.cursor()
    cur = con.cursor()
    cur.execute("INSERT INTO courses (id,name, hours, type) VALUES (%s,%s, %s, %s)", (id1,name, hours, type1))
    #mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Course added successfully'}), 200

@app.route('/add_papers', methods=['POST'])
def add_papers():
    id1 = int(request.form['id'])
    name = request.form['name']
    authorid = int(request.form['authorid'])
    publishdate = request.form['publishdate']
    type1 = int(request.form['type'])
    source = request.form['source']
    level = int(request.form['level'])
    rank = int(request.form['rank'])
    iscorresponding = int(request.form['is_corresponding_author'])

    try:
        cur = con.cursor()
        cur.callproc("PublishPaper", [id1, name, source, publishdate, authorid, rank, iscorresponding, type1, level])
        con.commit()
        message = 'Paper added successfully'
        status_code = 200

    except MySQLdb.OperationalError as e:
        # 获取错误信息的第二部分
        
        message = 'fail to add paper:{}'.format(e.args[1])
        status_code = 200
        return jsonify({'message': message}), 200
    finally:
        cur.close()

    return jsonify({'message': message}), status_code

@app.route('/delete_papers', methods=['POST'])
def delete_papers():
    id1 = int(request.form['id'])
    try:
        cur = con.cursor()
        cur.callproc("DeletePaper", [id1])
        while cur.nextset():
            pass
        con.commit()
        message = 'Paper deleted successfully'
        status_code = 200
    except MySQLdb.OperationalError as e:
        message = 'fail to delete paper:{}'.format(e.args[1])
        status_code = 200
        return jsonify({'message': message}), 200
    
    cur.close()
    return jsonify({'message': 'Paper deleted successfully'}), 200

@app.route('/delete_projects', methods=['POST'])
def delete_projects():
    id1 = int(request.form['id'])
    cur = con.cursor()
    cur.execute("DELETE FROM projects WHERE id = %s", [id1])
    con.commit()
    cur.close()
    return jsonify({'message': 'Project deleted successfully'}), 200

@app.route('/delete_courses', methods=['POST'])
def delete_courses():
    id1 = int(request.form['id'])
    cur = con.cursor()
    cur.execute("DELETE FROM courses WHERE id = %s", [id1])
    con.commit()
    cur.close()
    return jsonify({'message': 'Course deleted successfully'}), 200

@app.route('/update_papers', methods=['POST'])
def update_papers():
    data = request.get_json()  # 获取 JSON 数据
    id1 = int(data['id'])
    name = data['name']
    publishdate = data['publishdate']
    type1 = int(data['type'])
    source = data['source']
    level = int(data['level'])
    cur = con.cursor()
    cur.execute("UPDATE papers SET title = %s, publication_year = %s, type = %s, source = %s, level = %s WHERE id = %s", (name, publishdate, type1, source, level, id1))
    con.commit()
    cur.close()
    return jsonify({'message': 'Paper updated successfully'}), 200

@app.route('/update_projects', methods=['POST'])
def update_projects():
    data = request.get_json()
    id1 = int(data['id'])
    name = data['name']
    startdate = data['startdate']
    enddate = data['enddate']
    type1 = int(data['type'])
    source = data['source']
    fund = int(data['fund'])
    cur = con.cursor()
    cur.execute("UPDATE projects SET title = %s, start_year = %s, end_year = %s, type = %s, source = %s, total_funding = %s WHERE id = %s", (name, startdate, enddate, type1, source, fund, id1))
    con.commit()
    cur.close()
    return jsonify({'message': 'Project updated successfully'}), 200

@app.route('/update_courses', methods=['POST'])
def update_courses():
    data = request.get_json()
    id1 = int(data['id'])
    name = data['name']
    hours = int(data['hours'])
    type1 = int(data['type'])
    cur = con.cursor()
    cur.execute("UPDATE courses SET name = %s, hours = %s, type = %s WHERE id = %s", (name, hours, type1, id1))
    con.commit()
    cur.close()
    return jsonify({'message': 'Course updated successfully'}), 200

@app.route('/get_teachers', methods=['GET'])
def get_teachers():
    #cur = mysql.connection.cursor()
    cur = con.cursor()
    cur.execute("SELECT * FROM teachers")
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows), 200

@app.route('/get_courses', methods=['GET'])
def get_courses():
    #cur = mysql.connection.cursor()
    cur = con.cursor()
    cur.execute("SELECT * FROM courses")
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows), 200
@app.route('/get_papers', methods=['GET'])
def get_papers():
    #cur = mysql.connection.cursor()
    cur = con.cursor()
    cur.execute("SELECT * FROM papers")
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows), 200

@app.route('/search_paper', methods=['POST'])
def search_paper():
    id1 = int(request.form['id'])
    cur = con.cursor()
    cur.execute("SELECT * FROM papers WHERE id = %s", [id1])
    rows = cur.fetchall()
    cur.close()
    message = 'Paper found successfully'
    return jsonify(rows), 200

@app.route('/search_project', methods=['POST'])
def search_project():
    id1 = int(request.form['id'])
    cur = con.cursor()
    cur.execute("SELECT * FROM projects WHERE id = %s", [id1])
    rows = cur.fetchall()
    cur.close()
    message = 'Project found successfully'
    return jsonify(rows), 200

@app.route('/search_course', methods=['POST'])
def search_course():
    id1 = int(request.form['id'])
    cur = con.cursor()
    cur.execute("SELECT * FROM courses WHERE id = %s", [id1])
    rows = cur.fetchall()
    cur.close()
    message = 'Course found successfully'
    return jsonify(rows), 200

if __name__ == '__main__':
    app.run(debug=True)
