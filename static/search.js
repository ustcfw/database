document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('queryForm');
    const updatepaper = document.getElementById('updatePaper');
    const updateproject = document.getElementById('updateProject');
    const updatecourse = document.getElementById('updateCourse');
    // 调用API获取数据
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);

        fetch('/searchTeacher', {
            method: 'POST',
            body: formData
        })

        .then(response => response.json())
        .then(data => {
            
            displayResults(data);
        })
        .catch(error => console.error('Error:', error));

    });

    updatepaper.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(updatepaper);
        fetch('/updatePublishedPaper', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            const event = new Event('submit');
            form.dispatchEvent(event);
        })
        .catch(error => console.error('Error:', error));
    });
    document.getElementById('addPaperButton').addEventListener('click', function(event) {
        event.preventDefault();
        const formData = new FormData(updatepaper);
        fetch('/addPublishedPaper', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            const event = new Event('submit');
            form.dispatchEvent(event);
        })
        .catch(error => console.error('Error:', error));

        
    });

    document.getElementById('addProjectButton').addEventListener('click', function(event) {
        event.preventDefault();
        const formData = new FormData(updateproject);
        fetch('/addUndertakenProject', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            const event = new Event('submit');
            form.dispatchEvent(event);
        })
        .catch(error => console.error('Error:', error));
    });

    document.getElementById('addCourseButton').addEventListener('click', function(event) {
        event.preventDefault();
        const formData = new FormData(updatecourse);
        fetch('/addMainCourse', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            const event = new Event('submit');
            form.dispatchEvent(event);
        })
        .catch(error => console.error('Error:', error));
    }
    );


    updateproject.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(updateproject);
        fetch('/updateUndertakenProject', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            const event = new Event('submit');
            form.dispatchEvent(event);
        })
        .catch(error => console.error('Error:', error));
    });
    

    updatecourse.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(updatecourse);
        fetch('/updateMainCourse', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            const event = new Event('submit');
            form.dispatchEvent(event);
        })
        .catch(error => console.error('Error:', error));
    });
    


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
    function getProjectType(type){
        switch(type){
            case 1:
                return '国家级项目';
            case 2:
                return '省部级项目';
            case 3:
                return '市厅级项目';
            case 4:
                return '企业合作项目';
            case 5:
                return '其他类型项目';
        }
    }
    function getCourseSemester(semester){
        switch(semester){
            case 1:
                return '春季学期';
            case 2:
                return '夏季学期';
            case 3:
                return '秋季学期';
        }
    }
    function getTeacherTitle(title){
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
    

    function displayResults(data) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // 清空之前的结果
        // 展示教师信息
        const teacherDiv = document.createElement('p');
        teacherDiv.classList.add('section');
        teacherDiv.innerHTML = `<h2>教师信息</h2>
                                <p>教师编号: ${data.teacher[0]}     教师姓名: ${data.teacher[1]}
                                </p>
                                <p>教师职称: ${getTeacherTitle(data.teacher[3])}        教师性别:${data.teacher[2]===1 ? '男' : '女' }
                                </p>`;
        resultsDiv.appendChild(teacherDiv);
        // 展示论文信息

        const infoDiv = document.createElement('h2');
        infoDiv.innerHTML = '论文';
        resultsDiv.appendChild(infoDiv);
        // 展示论文信息
        const papersDiv = document.createElement('table');
        papersDiv.style.justifyContent = 'center';
        papersDiv.style.flexDirection = 'column';
        papersDiv.style.alignItems = 'center';
        papersDiv.classList.add('section');
        const tr = document.createElement('tr');
        tr.innerHTML = `<tr><th>论文编号</th><th>标题</th><th>发表源</th>
                        <th>发表日期</th><th>类型</th><th>级别</th>
                        <th>排名</th><th>是否通讯作者</th><th>操作</th></tr>`;
        papersDiv.appendChild(tr);
        data.papers.forEach(paper => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-author-id', paper[0]);
            tr.innerHTML = `<td>${paper[4]}</td><td>${paper[5]}</td><td>${paper[6]}</td>
                            <td>${paper[7]}</td><td>${getPaperType(paper[8]) }</td>
                            <td>${getPaperLevel(paper[9]) }</td><td>${paper[1]}</td>
                            <td>${paper[2]===1? '是' :'否' }</td>
                            <td>
                                <button class="delete-button">删除</button>
                            </td>`;
            papersDiv.appendChild(tr);
            
        });
            
        resultsDiv.appendChild(papersDiv);
        
      
        // 展示项目信息
        const infoDiv1 = document.createElement('h2');
        infoDiv1.innerHTML = '项目';
        resultsDiv.appendChild(infoDiv1);
        const projectsDiv = document.createElement('table');
        projectsDiv.classList.add('section');
        projectsDiv.style.justifyContent = 'center';
        projectsDiv.style.flexDirection = 'column';
        projectsDiv.style.alignItems = 'center';
        const tr1 = document.createElement('tr');
        tr1.innerHTML = `<tr><th>项目编号</th><th>标题</th><th>项目源</th>
                        <th>项目类型</th><th>总资金</th><th>起始年份</th>
                        <th>结束年份</th><th>承担经费</th><th>排名</th>
                        <th>操作</th></tr>`;
        projectsDiv.appendChild(tr1);
        data.projects.forEach(project => {
          const tr = document.createElement('tr');
          tr.setAttribute('data-author-id', project[7]);
          tr.innerHTML = `<td>${project[0]}</td><td>${project[1]}</td><td>${project[2]}</td>
                            <td>${getProjectType(project[3]) }</td><td>${project[4]}</td>
                            <td>${project[5]}</td><td>${project[6]}</td><td>${project[9]}</td>
                            <td>${project[8]}</td>
                            <td>
                                <button class="delete-button1">删除</button>
                            </td>`;
          projectsDiv.appendChild(tr);
        });
        resultsDiv.appendChild(projectsDiv);
        
        const infoDiv2 = document.createElement('h2');
        infoDiv2.innerHTML = '课程';
        resultsDiv.appendChild(infoDiv2);
        // 展示课程信息
        const coursesDiv = document.createElement('table');
        coursesDiv.classList.add('section');
        coursesDiv.style.justifyContent = 'center';
        coursesDiv.style.flexDirection = 'column';
        coursesDiv.style.alignItems = 'center';
        const tr2 = document.createElement('tr');
        tr2.innerHTML = `<tr><th>课程编号</th><th>课程名</th><th>课程总学时</th>
                        <th>课程类型</th><th>主讲学时</th><th>学年</th><th>学期</th><th>操作</th></tr>`;
        coursesDiv.appendChild(tr2);
        data.courses.forEach(course => {
          const tr = document.createElement('tr');
          tr.setAttribute('data-author-id', course[4]);
            tr.innerHTML = `<td>${course[0]}</td><td>${course[1]}</td><td>${course[2]}</td>
                                <td>${course[3]===1 ? '本科生课程' : '研究生课程'}</td>
                                <td>${course[7]}</td><td>${course[5]}</td>
                                <td>${getCourseSemester(course[6]) }</td>
                                <td>
                                    <button class="delete-button2">删除</button>
                                </td>`;
          coursesDiv.appendChild(tr);
        });
        resultsDiv.appendChild(coursesDiv);
      }
      const resultsDiv = document.getElementById('results');
      resultsDiv.addEventListener('click', function(event) {
        if (event.target.className === 'delete-button') {
          // 处理论文删除逻辑
          const authorId = event.target.closest('tr').getAttribute('data-author-id');
          const data = {};
            data.authorId = authorId;
            data.paperId = event.target.closest('tr').children[0].textContent;
            fetch('/deletePublishedPaper',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                event.target.closest('tr').remove();
            })

          console.log(`删除论文，作者ID: ${authorId}`);
          // 这里添加删除论文的代码
        } else if (event.target.className === 'delete-button1') {
            const authorId = event.target.closest('tr').getAttribute('data-author-id');
            const projectId = event.target.closest('tr').children[0].textContent;
            console.log(`删除项目，作者ID: ${authorId}`);
            fetch('/deleteUndertakenProject', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ authorId, projectId })
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              // 删除成功后，移除这一行
              event.target.closest('tr').remove();
            })
            .catch(error => console.error('Error:', error));
          // 这里添加删除项目的代码
        } else if (event.target.className === 'delete-button2') {
          // 处理课程删除逻辑
            const authorId = event.target.closest('tr').getAttribute('data-author-id');
            const courseId = event.target.closest('tr').children[0].textContent;
            console.log(`删除课程，作者ID: ${authorId}`);
            fetch('/deleteMainCourse', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ authorId, courseId })
            })
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                // 删除成功后，移除这一行
                event.target.closest('tr').remove();
            })
            .catch(error => console.error('Error:', error));
          // 这里添加删除课程的代码
        }
      });

      
        
});