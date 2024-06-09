document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-teacher-form');/*add-course-form*/
    const form2 = document.getElementById('add-course-form');
    const addpaper = document.getElementById('add-paper-form');
    const deletepaper = document.getElementById('delete-paper-form');
    const deleteproject = document.getElementById('delete-project-form');
    const teachersList = document.getElementById('teachers-list');
    const coursesList = document.getElementById('courses-list');
    const teachertable = document.getElementById('teacher-table');
    const coursetable = document.getElementById('course-table');
    const papertable = document.getElementById('paper-table');
    const projecttable = document.getElementById('project-table');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);

        fetch('/add_teacher', {
            method: 'POST',
            body: formData
        })
        
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchTeachersintable();
        })
        .catch(error => console.error('Error:', error));
        
    });
    form2.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form2);

        fetch('/add_courses', {
            method: 'POST',
            body: formData
        })
        
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchCourseintable();
        })
        .catch(error => console.error('Error:', error));
        
    });
   
    deletepaper.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(deletepaper);

        fetch('/delete_papers', {
            method: 'POST',
            body: formData
        })

        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchPaper();
        })
        .catch(error => console.error('Error:', error));

    });

    deleteproject.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(deleteproject);

        fetch('/delete_projects', {
            method: 'POST',
            body: formData
        })

        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchProject();
        })
        .catch(error => console.error('Error:', error));

    });
    


    function fetchTeachers() {
        fetch('/get_teachers')
        .then(response => response.json())
        .then(data => {
            teachersList.innerHTML = '';
            data.forEach(teacher => {
                const li = document.createElement('li');
                li.textContent = `Name: ${teacher[1]}, Gender: ${teacher[2] === 1 ? 'Male' : 'Female'}, Title: ${teacher[3]}`;
                teachersList.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
    }
    function transfortitle(title){
        switch (title) {
            case 1:
                return 'Postdoc';
            case 2:
                return 'Assistant';
            case 3:
                return 'Lecturer';
            case 4:
                return 'Associate Professor';
            case 5:
                return 'Special Professor';
            case 6:
                return 'Professor';
            case 7:
                return 'Research Assistant';
            case 8:
                return 'Special associate Researcher';
            case 9:
                return 'Associate Researcher';
            case 10:
                return 'Special Researcher';
            case 11:
                return 'Researcher';
            default:
                return '未知';
        }

    }
    function transforproject(project){
        switch (project) {
            case 1:
                return '国家级项目';
            case 2:
                return '省部级项目';
            case 3:
                return '市厅级项目';
            case 4:
                return '企业合作项目';
            case 5:
                return '其他项目';
            default:
                return '未知';
        }

    }
    function getPaperType(type){
        switch(type){
            case 1:
                return 'full paper';
            case 2:
                return 'short paper';
            case 3:
                return 'poster paper';
            case 4:
                return 'demo paper';
        }
    }
    function getPaperLevel(level){
        switch(level){
            case 1:
                return 'CCF-A';
            case 2:
                return 'CCF-B';
            case 3:
                return 'CCF-C';
            case 4:
                return '中文CCF-A';
            case 5:
                return '中文CCF-B';
            case 6:
                return '无级别';
        }
    }
    function fetchTeachersintable(){
        fetch('/get_teachers')
        .then(response => response.json())  
        .then(data => {
            teachertable.innerHTML = '';
            const tr = document.createElement('tr');
            tr.innerHTML = `<th>编号</th><th>姓名</th><th>性别</th><th>职称</th>`;
            teachertable.appendChild(tr);
            data.forEach(teacher => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${teacher[0]}</td><td>${teacher[1]}</td><td>${teacher[2] === 1 ?'Male' : 'Female'}</td><td>${transfortitle(teacher[3]) }</td>`;
                teachertable.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    
    function fetchCourses() {
        fetch('/get_courses')
        .then(response => response.json())
        .then(data => {
            coursesList.innerHTML = '';         
            data.forEach(course => {
                const li = document.createElement('li');
                li.textContent = `ID: ${course[0]}, Name: ${course[1]  }, Hours: ${course[2]}, Type: ${course[3]===1 ? '本科生课程' : '研究生课程'}`;
                coursesList.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
    }
    function fetchCourseintable(){
        fetch('/get_courses')
        .then(response => response.json())
        .then(data => {
            coursetable.innerHTML = '';
            const tr = document.createElement('tr');
            tr.innerHTML = `<th>编号</th><th>课程名</th><th>学时</th><th>类型</th>`;
            coursetable.appendChild(tr);
            data.forEach(course => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${course[0]}</td><td>${course[1]}</td><td>${course[2]}</td><td>${course[3]===1 ? '本科生课程' : '研究生课程'}</td>`;
                coursetable.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
    }
    function fetchPaper(){
        fetch('/get_papers')
        .then(response => response.json())
        .then(data => {
            papertable.innerHTML = '';
            const tr = document.createElement('tr');
            tr.innerHTML = `<th>论文编号</th><th>论文名</th><th>发表源</th><th>发表日期</th>
            <th>论文类型</th><th>论文级别</th>`;
            papertable.appendChild(tr);
            data.forEach(paper => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${paper[0]}</td><td>${paper[1]}</td><td>${paper[2]}</td>
                <td>${paper[3]}</td><td>${getPaperType(paper[4]) }</td><td>${getPaperLevel(paper[5]) }</td>`;
                papertable.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    function fetchProject(){
        fetch('/get_projects')
        .then(response => response.json())
        .then(data => {
            projecttable.innerHTML = '';
            const tr = document.createElement('tr');
            tr.innerHTML = `<th>项目编号</th><th>项目名称</th><th>项目源</th>
                            <th>项目类型</th><th>项目经费</th><th>结束日期</th><th>开始日期</th>`;
            projecttable.appendChild(tr);
            data.forEach(project => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${project[0]}</td><td>${project[1]}</td>
                                <td>${project[2]}</td>
                                <td>${transforproject(project[3])}</td><td>${project[4]}</td>
                                <td>${project[5]}</td><td>${project[6]}</td>`;
                projecttable.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    fetchTeachersintable();

    fetchCourseintable();

    fetchPaper();

    fetchProject();
    
    document.getElementById('button').addEventListener('click', function() {
        fetchTeachersintable();

        fetchCourseintable();

        fetchPaper();

        fetchProject();

    });
    document.getElementById('coursebutton').addEventListener('click', function() {
        fetchCourseintable();

    });
    document.getElementById('paperbutton').addEventListener('click', function() {
        fetchPaper();

    });
    document.getElementById('projectbutton').addEventListener('click', function() {
        fetchProject();

    });
    
});
