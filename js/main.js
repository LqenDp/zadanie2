let app = new Vue({
    el: '#app',
    data: {
        appName: 'Мои заметки',
        newCardTitle: '',
        newCardTasks: '',
        cards: [],
        filter: 'all'  // all, col1, col2, col3
    },
    methods: {
        addCard() {
            if (this.newCardTitle.trim() && this.newCardTasks.trim()) {
                const tasks = this.newCardTasks
                    .split('\n')
                    .filter(t => t.trim())
                    .map(t => ({ text: t.trim(), completed: false }));
                
                this.cards.push({
                    id: Date.now(),
                    title: this.newCardTitle,
                    tasks: tasks,
                    column: 0,
                    completionDate: null
                });
                
                this.newCardTitle = '';
                this.newCardTasks = '';
                
                console.log('Карточка добавлена! Всего карточек:', this.cards.length);
            } else {
                alert('Заполните все поля!');
            }
        }
    }
})