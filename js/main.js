let app = new Vue({
    el: '#app',
    data: {
        appName: 'Мои заметки',
        newCardTitle: '',      
        newCardTasks: '',  
        column1Count: 0,
        column2Count: 0,
        column3Count: 0
    },
    methods: {
        addCard() {
            console.log('Заголовок:', this.newCardTitle);
            console.log('Задачи:', this.newCardTasks);
            
            this.newCardTitle = '';
            this.newCardTasks = '';
        }
    }
})