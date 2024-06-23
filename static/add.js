document.addEventListener('DOMContentLoaded', function() {
    
    const addpaper = document.getElementById('add-paper-form');
    const addproject = document.getElementById('add-project-form');
    const papertable = document.getElementById('papertable');
    const projecttable = document.getElementById('projecttable');
    

   
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
                tr.innerHTML = `<td>${paper[0]}</td><td>${paper[1]}</td><td>${paper[2]}</td><td>${paper[3]}</td><td>${getPaperType(paper[4])}</td><td>${getPaperLevel(paper[5])}</td>`;
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
                            <th>项目类型</th><th>项目经费</th><th>开始日期</th><th>结束日期</th>`;
            projecttable.appendChild(tr);
            data.forEach(project => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${project[0]}</td><td>${project[1]}</td>
                                <td>${project[2]}</td>
                                <td>${transforproject(project[3])}</td>
                                <td>${project[4]}</td><td>${project[5]}</td>
                                <td>${project[6]}</td>`;
                projecttable.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
    }


    
    
});
