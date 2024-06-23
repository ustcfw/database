document.addEventListener('DOMContentLoaded', function() {
    const searchpaper = document.getElementById('search-paper-form');
    const searchproject = document.getElementById('search-project-form');
    const searchcourse = document.getElementById('search-course-form');
    
    const papertable = document.getElementById('paper-table');
    const projecttable = document.getElementById('project-table');
    const coursetable = document.getElementById('course-table');

    function addEditButtonListener(button) {
        button.addEventListener('click', function() {
            const tr = this.parentNode.parentNode;
            const tdElements = tr.querySelectorAll('td:not(:last-child)');
            const fieldNames = ['id', 'name','source', 'publishdate', 'type',  'level'];
            const inputTypes = ['number', 'text', 'text','date', 'number',  'number'];
            tdElements.forEach((td, index) => {
                const text = td.textContent;
                if(fieldNames[index] ==='type'){

                    const input = document.createElement('select');
                    input.name = fieldNames[index];
                    input.id = 'type';
                    input.style.width = '100%';
                    const option1 = ['full paper', 'short paper', 'poster paper', 'demo paper'];
                    option1.forEach((option1,i) => {
                        const option = document.createElement('option');
                        option.value = i+1;
                        option.textContent = option1;
                        if(option1 === text)
                            option.selected = true;
                        input.appendChild(option);
                    });
                    
                    td.textContent = '';
                    td.appendChild(input);
                }
                else if (fieldNames[index] === 'level'){
                    const input = document.createElement('select');
                    input.name = fieldNames[index];
                    input.id = 'level';
                    input.style.width = '100%';
                    const option2 = ['CCF-A', 'CCF-B', 'CCF-C','中文CCF-A', '中文CCF-B', '无级别'];
                    option2.forEach((option2,i) => {
                        const option = document.createElement('option');
                        option.value = i+1;
                        option.textContent = option2;
                        if(option2 === text)
                            option.selected = true;
                        input.appendChild(option);
                    });
                    
                    td.textContent = '';
                    td.appendChild(input);
                }
                else {
                    const input = document.createElement('input');
                    input.name = fieldNames[index];
                    input.type = inputTypes[index];
                    if (input.type === 'date') {
                        // 将日期转换为 "YYYY-MM-DD" 格式
                        const date = new Date(text);
                        input.value = date.toISOString().split('T')[0];
                    } else {
                        input.value = text;
                    }
                    input.style.width = '100%';
                    td.textContent = '';
                    td.appendChild(input);
                }
                
            });
    
            const actionTd = tr.querySelector('td:last-child');
            actionTd.innerHTML = `
                <button class="submit-button">提交</button>
                <button class="cancel-button">取消</button>
            `;
    
            const submitButton = actionTd.querySelector('.submit-button');
            submitButton.addEventListener('click', function() {
                const data = {};
                tdElements.forEach(td => {
                    const input = td.querySelector('input');
                    const select = td.querySelector('select');
                    if (input) {
                        data[input.name] = input.value;
                    }
                    else if (select){
                        data[select.name] = select.value;
                    }
                });
                fetch('/update_papers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const event = new Event('submit');
                    searchpaper.dispatchEvent(event);
                    
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
            });
    
            const cancelButton = actionTd.querySelector('.cancel-button');
            cancelButton.addEventListener('click', function() {
                tdElements.forEach(td => {
                    const input = td.querySelector('input');
                    const select = td.querySelector('select');
                    if (input) {
                        const text = input.value;
                        td.textContent = text;
                    } else if (select) {
                        const text = select.options[select.selectedIndex].text;
                        td.textContent = text;
                    }
                });
    
                actionTd.innerHTML = `
                    <button class="edit-button">修改</button>
                    <button class="delete-button">删除</button>
                `;
    
                const editButton = actionTd.querySelector('.edit-button');
                addEditButtonListener(editButton);
                const deleteButton = actionTd.querySelector('.delete-button');
                addDeleteButtonListener(deleteButton);
                
                const event = new Event('submit');
                searchpaper.dispatchEvent(event);
                 
            });
        });
    }
    function addDeleteButtonListener(button){
        button.addEventListener('click',function(){
            const tr = this.parentNode.parentNode;
            const paperId = tr.children[0].textContent;

        fetch('/delete_papers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${encodeURIComponent(paperId)}`,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            tr.parentNode.removeChild(tr);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
        }
    );
    }
   
    function addEditProjectButtonListener(button) {
        button.addEventListener('click', function() {
            const tr = this.parentNode.parentNode;
            const tdElements = tr.querySelectorAll('td:not(:last-child)');
            const fieldNames = ['id', 'name','source', 'type', 'fund', 'startdate', 'enddate'];
            const inputTypes = ['number', 'text', 'text', 'number', 'number', 'number', 'number']
            tdElements.forEach((td, index) => {
                const text = td.textContent;
                if(fieldNames[index] ==='type'){
                    const input = document.createElement('select');
                    input.name = fieldNames[index];
                    input.id = 'type';
                    input.style.width = '100%';
                    const option1 = ['国家级项目', '省部级项目', '市厅级项目', '企业合作项目', '其他类型项目'];
                    option1.forEach((option1,i) => {
                        const option = document.createElement('option');
                        option.value = i+1;
                        option.textContent = option1;
                        if(option1 === text)
                            option.selected = true;
                        input.appendChild(option);
                    });
                    
                    td.textContent = '';
                    td.appendChild(input);
                }
                else {

                const input = document.createElement('input');
                    input.name = fieldNames[index];
                    input.type = inputTypes[index];
                    if (input.type === 'date') {
                        // 将日期转换为 "YYYY-MM-DD" 格式
                        const date = new Date(text);
                        input.value = date.toISOString().split('T')[0];
                    } else {
                        input.value = text;
                    }
                    input.style.width = '100%';
                    td.textContent = '';
                    td.appendChild(input);
                }
                });
    
            const actionTd = tr.querySelector('td:last-child');
            actionTd.innerHTML = `
                <button class="submit-button">提交</button>
                <button class="cancel-button">取消</button>
            `;
    
            const submitButton = actionTd.querySelector('.submit-button');
            submitButton.addEventListener('click', function() {
                const data = {};
                tdElements.forEach(td => {
                    const input = td.querySelector('input');
                    const select = td.querySelector('select');
                    if (input) {
                        data[input.name] = input.value;
                    }
                    else if (select){
                        data[select.name] = select.value;
                    }
                });
                fetch('/update_projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const event = new Event('submit');
                    searchproject.dispatchEvent(event);
                    
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
            });
    
            const cancelButton = actionTd.querySelector('.cancel-button');
            cancelButton.addEventListener('click', function() {
                tdElements.forEach(td => {
                    const input = td.querySelector('input');
                    const select = td.querySelector('select');
                    if (input) {
                        const text = input.value;
                        td.textContent = text;
                    } else if (select) {
                        const text = select.options[select.selectedIndex].text;
                        td.textContent = text;
                    }
                });
    
                actionTd.innerHTML = `
                    <button class="edit-button">修改</button>
                    <button class="delete-button">删除</button>
                `;
    
                const editButton = actionTd.querySelector('.edit-button');
                addEditProjectButtonListener(editButton);
                const deleteButton = actionTd.querySelector('.delete-button');
                addDeleteProjectButtonListener(deleteButton);
                const event = new Event('submit');
                searchproject.dispatchEvent(event);
            });
        });
    }
    function addDeleteProjectButtonListener(button){
        button.addEventListener('click',function(){
            const tr = this.parentNode.parentNode;
            const projectId = tr.children[0].textContent;

        fetch('/delete_projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${encodeURIComponent(projectId)}`,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            tr.parentNode.removeChild(tr);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
        }
    );
    }

    function addEditCourseButtonListener(button) {
        button.addEventListener('click', function() {
            const tr = this.parentNode.parentNode;
            const tdElements = tr.querySelectorAll('td:not(:last-child)');
            const fieldNames = ['id', 'name', 'hours', 'type'];
            const inputTypes = ['number', 'text', 'number', 'number'];
            tdElements.forEach((td, index) => {
                
                const text = td.textContent;
                if(fieldNames[index] ==='type'){
                    const input = document.createElement('select');
                    input.name = fieldNames[index];
                    input.id = 'type';
                    input.style.width = '100%';
                    const option1 = ['本科生课程', '研究生课程'];
                    option1.forEach((option1,i) => {
                        const option = document.createElement('option');
                        option.value = i+1;
                        option.textContent = option1;
                        if(option1 === text)
                            option.selected = true;
                        input.appendChild(option);
                    });
                    
                    td.textContent = '';
                    td.appendChild(input);
                }
                else {
                    const input = document.createElement('input');
                    input.name = fieldNames[index];
                    input.type = inputTypes[index];
                    input.value = text;
                    input.style.width = '100%';
                    td.textContent = '';
                    td.appendChild(input);
                }
            });

            const actionTd = tr.querySelector('td:last-child');
            actionTd.innerHTML = `
                <button class="submit-button">提交</button>
                <button class="cancel-button">取消</button>
            `;

            const submitButton = actionTd.querySelector('.submit-button');
            submitButton.addEventListener('click', function() {
                const data = {};
                tdElements.forEach(td => {
                    const input = td.querySelector('input');
                    const select = td.querySelector('select');
                    if (input) {
                        data[input.name] = input.value;
                    }
                    else if (select){
                        data[select.name] = select.value;
                    }
                });
                fetch('/update_courses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const event = new Event('submit');
                    searchcourse.dispatchEvent(event);
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
            });

            const cancelButton = actionTd.querySelector('.cancel-button');
            cancelButton.addEventListener('click', function() {
                tdElements.forEach(td => {
                    const input = td.querySelector('input');
                    const select = td.querySelector('select');
                    if (input) {
                        const text = input.value;
                        td.textContent = text;
                    } else if (select) {
                        const text = select.options[select.selectedIndex].text;
                        td.textContent = text;
                    }
                });

                actionTd.innerHTML = `
                    <button class="edit-button">修改</button>
                    <button class="delete-button">删除</button>
                `;

                const editButton = actionTd.querySelector('.edit-button');
                addEditCourseButtonListener(editButton);
                const deleteButton = actionTd.querySelector('.delete-button');
                addDeleteCourseButtonListener(deleteButton);
                const event = new Event('submit');
                searchcourse.dispatchEvent(event);
            });
        });
    }

    function addDeleteCourseButtonListener(button) {
        button.addEventListener('click', function() {
            const tr = this.parentNode.parentNode;
            const courseId = tr.children[0].textContent;

            fetch('/delete_courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${encodeURIComponent(courseId)}`,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                tr.parentNode.removeChild(tr);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        });
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

    searchpaper.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(searchpaper);

        fetch('/search_paper', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            
            papertable.innerHTML = '';
            const tr = document.createElement('tr');
            tr.innerHTML = `<th>论文编号</th>
                            <th>论文名</th>
                            <th>发表源</th>
                            <th>发表日期</th>
                            <th>论文类型</th>
                            <th>论文级别</th>
                            <th>操作</th>
                            `;
            papertable.appendChild(tr);
            data.forEach(paper => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${paper[0]}</td><td>${paper[1]}</td><td>${paper[2]}</td>
                                <td>${paper[3]}</td><td>${getPaperType(paper[4]) }</td><td>${getPaperLevel(paper[5]) }</td>
                                <td>
                                    <button class="edit-button">修改</button>
                                    <button class="delete-button">删除</button>
                                </td> `;
                papertable.appendChild(tr);
            });
            document.querySelectorAll('.edit-button').forEach(button => {
                addEditButtonListener(button);
            });
            document.querySelectorAll('.delete-button').forEach(button => {
                addDeleteButtonListener(button);
            });
            });
        });
    
    searchproject.addEventListener('submit',function(event){
        event.preventDefault();
        const formData = new FormData(searchproject);

        fetch('/search_project',{
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            projecttable.innerHTML = '';
            const tr = document.createElement('tr');
            tr.innerHTML = `<th>项目编号</th>
                            <th>项目名</th>
                            <th>项目来源</th>
                            <th>项目类型</th>
                            <th>经费</th>
                            <th>开始日期</th>
                            <th>结束日期</th>
                            <th>操作</th>
                            `;
            projecttable.appendChild(tr);
            data.forEach(project => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${project[0]}</td><td>${project[1]}</td><td>${project[2]}</td>
                                <td>${getProjectType(project[3]) }</td><td>${project[4]}</td>
                                <td>${project[5]}</td><td>${project[6]}</td>
                                <td>
                                    <button class="edit-button">修改</button>
                                    <button class="delete-button">删除</button>
                                </td> `;
                projecttable.appendChild(tr);
            });
            document.querySelectorAll('.edit-button').forEach(button => {
                addEditProjectButtonListener(button);
            });
            document.querySelectorAll('.delete-button').forEach(button => {
                addDeleteProjectButtonListener(button);
            });
        });
    }
    )

    searchcourse.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(searchcourse);

        fetch('/search_course', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data=>{
            coursetable.innerHTML = '';
            const tr = document.createElement('tr');
            tr.innerHTML = `<th>编号</th><th>课程名</th><th>学时</th><th>类型</th><th>操作</th>`;
            coursetable.appendChild(tr);
            data.forEach(course => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${course[0]}</td><td>${course[1]}</td><td>${course[2]}</td><td>${course[3]===1 ? '本科生课程' : '研究生课程'}</td>
                                <td>
                                    <button class="edit-button">修改</button>
                                    <button class="delete-button">删除</button>
                                </td>`;
                coursetable.appendChild(tr);
            });
            document.querySelectorAll('.edit-button').forEach(button => {
                addEditCourseButtonListener(button);
            });
            document.querySelectorAll('.delete-button').forEach(button => {
                addDeleteCourseButtonListener(button);
            });

        }
        )
    }
    )
    
})