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
        },
        toggleTask(cardId, taskIndex) {
            const card = this.cards.find(c => c.id === cardId);
            if (card) {
                card.tasks[taskIndex].completed = !card.tasks[taskIndex].completed;
                console.log(`Задача ${taskIndex + 1} в карточке "${card.title}" отмечена как ${card.tasks[taskIndex].completed ? 'выполненная' : 'невыполненная'}`);
            }
        }
    },
    computed: {
        totalCompletedTasks() {
            let total = 0;
            this.cards.forEach(card => {
                total += card.tasks.filter(t => t.completed).length;
            });
            return total;
        }
    },
})