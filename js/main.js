let app = new Vue({
    el: '#app',
    data: {
        appName: 'Мои заметки',
        newCardTitle: '',
        newCardTasks: '',
        cards: []
    },
    methods: {
        addCard() {
            if (this.newCardTitle.trim() && this.newCardTasks.trim()) {
                const tasks = this.newCardTasks
                    .split('\n')
                    .filter(t => t.trim())
                    .map(t => ({ text: t.trim(), completed: false }));
                
                if (this.column1Cards.length >= 3) {
                    alert('В первой колонке больше нет места (максимум 3 карточки)');
                    return;
                }
                
                this.cards.push({
                    id: Date.now(),
                    title: this.newCardTitle,
                    tasks: tasks,
                    column: 0,
                    completionDate: null
                });
                
                this.newCardTitle = '';
                this.newCardTasks = '';
                
                console.log('Карточка добавлена!');
            } else {
                alert('Заполните все поля!');
            }
        },
        
        toggleTask(cardId, taskIndex) {
            const card = this.cards.find(c => c.id === cardId);
            if (card) {
                card.tasks[taskIndex].completed = !card.tasks[taskIndex].completed;
                console.log(`Задача отмечена`);
                
                this.checkAndMoveCard(card);
            }
        },
        
        deleteCard(cardId) {
            if (confirm('Удалить карточку?')) {
                this.cards = this.cards.filter(c => c.id !== cardId);
                console.log('Карточка удалена');
            }
        },
        
        checkAndMoveCard(card) {
            const completedCount = card.tasks.filter(t => t.completed).length;
            const totalCount = card.tasks.length;
            const percentage = (completedCount / totalCount) * 100;
            
            console.log(`Карточка "${card.title}": ${completedCount}/${totalCount} = ${percentage}%`);
            
            let moved = false;
            
            if (card.column === 0 && percentage > 50) {
                console.log(`→ Карточка "${card.title}" перемещается в колонку 1 (${percentage}%)`);
                card.column = 1;
                moved = true;
            }
            
            if (card.column === 1 && percentage === 100) {
                console.log(`→ Карточка "${card.title}" перемещается в колонку 2 (100%)`);
                card.column = 2;
                card.completionDate = Date.now();
                moved = true;
            }
            
            if (moved) {
                console.log('Карточка перемещена!');
            }
        },
        
    },
    computed: {
        column1Cards() {
            return this.cards.filter(c => c.column === 0);
        },
        column2Cards() {
            return this.cards.filter(c => c.column === 1);
        },
        column3Cards() {
            return this.cards.filter(c => c.column === 2);
        },
        isColumn1Full() {
            return this.column1Cards.length >= 3;
        },
        isColumn2Full() {
            return this.column2Cards.length >= 5;
        },
        totalCompletedTasks() {
            let total = 0;
            this.cards.forEach(card => {
                total += card.tasks.filter(t => t.completed).length;
            });
            return total;
        }
    },
    // watch - УДАЛЯЕМ ПОЛНОСТЬЮ!
    
})