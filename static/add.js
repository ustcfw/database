document.addEventListener('DOMContentLoaded', function() {
    
    const addpaper = document.getElementById('add-paper-form');
    const addproject = document.getElementById('add-project-form');
    

   
    addpaper.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(addpaper);

        fetch('/add_papers', {
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
    

    addproject.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(addproject);

        fetch('/add_projects', {
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
            tr.innerHTML = `<th>论文编号</th><th>论文名</th><th>发表源</th><th>发表日期</th><th>论文类型</th><th>论文级别</th>`;
            papertable.appendChild(tr);
            data.forEach(paper => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${paper[0]}</td><td>${paper[1]}</td><td>${paper[2]}</td><td>${paper[3]}</td><td>${paper[4]}</td><td>${paper[5]}</td>`;
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
            tr.innerHTML = `<th>项目编号</th><th>项目名称</th>
                            <th>项目类型</th><th>开始日期</th><th>结束日期</th><th>项目经费</th>`;
            projecttable.appendChild(tr);
            data.forEach(project => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${project[0]}</td><td>${project[1]}</td>
                                <td>${transforproject(project[2])}</td>
                                <td>${project[3]}</td><td>${project[4]}</td><td>${project[5]}</td>`;
                projecttable.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
    }


    
    
});
