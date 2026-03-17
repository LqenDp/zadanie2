
Vue.component('task-card', {
    props: {
        card: Object,
        isColumn1Blocked: Boolean,
        columnIndex: Number
    },
    template: `
        <div class="card" :class="{ 'completed-card': card.column === 2 }">
            <div v-if="card.column === 0 && isColumn1Blocked" class="blocked-overlay">
                 Колонка заблокирована
            </div>
            
            <div class="card-header">
                <h3 class="card-title">{{ card.title }}</h3>
                <button class="delete-btn" @click="$emit('delete-card', card.id)">✕</button>
            </div>
            
            <ul class="task-list">
                <li v-for="(task, taskIndex) in card.tasks" :key="taskIndex" class="task-item">
                    <input 
                        type="checkbox" 
                        class="task-checkbox"
                        :checked="task.completed"
                        @change="$emit('toggle-task', { cardId: card.id, taskIndex: taskIndex })"
                        :disabled="card.column === 0 && isColumn1Blocked"
                    >
                    <span 
                        class="task-text" 
                        :class="{ completed: task.completed }"
                    >
                        {{ task.text }}
                    </span>
                </li>
            </ul>
            
            <div class="task-stats">
                Выполнено: {{ completedCount }}/{{ card.tasks.length }}
                ({{ progressPercentage }}%)
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            
            <div v-if="card.column === 2 && card.completionDate" class="completion-date">
                 Завершена: {{ card.completionDate }}
            </div>
        </div>
    `,
    computed: {
        completedCount() {
            return this.card.tasks.filter(t => t.completed).length;
        },
        progressPercentage() {
            return Math.round((this.completedCount / this.card.tasks.length) * 100);
        }
    }
});

Vue.component('task-column', {
    props: {
        title: String,
        cards: Array,
        columnIndex: Number,
        maxCards: [Number, String],
        isColumn1Blocked: Boolean
    },
    template: `
        <div class="column">
            <div class="column-header">
                <h2>{{ title }}</h2>
                <span class="count">{{ cards.length }}/{{ maxDisplay }}</span>
            </div>
            
            <div v-if="cards.length === 0" class="empty-message">
                Нет карточек
            </div>
            
            <div v-for="card in cards" :key="card.id" class="card-wrapper">
                <task-card
                    :card="card"
                    :is-column1-blocked="isColumn1Blocked"
                    :column-index="columnIndex"
                    @toggle-task="$emit('toggle-task', $event)"
                    @delete-card="$emit('delete-card', $event)"
                ></task-card>
            </div>
        </div>
    `,
    computed: {
        maxDisplay() {
            return this.maxCards === Infinity ? '∞' : this.maxCards;
        }
    }
});

Vue.component('add-card-form', {
    props: {
        isAddingBlocked: Boolean,
        isColumn1Full: Boolean
    },
    data() {
        return {
            newCardTitle: '',
            newCardTasks: ''
        };
    },
    template: `
        <div class="form-container">
            <h3>Новая карточка</h3>
            
            <div v-if="isAddingBlocked" class="warning-message">
                 Добавление карточек заблокировано: во втором столбце нет места
            </div>
            
            <div class="form-group">
                <label>Название:</label>
                <input 
                    type="text" 
                    class="form-control"
                    v-model="newCardTitle" 
                    placeholder="Введите название"
                    :disabled="isAddingBlocked"
                >
            </div>
            
            <div class="form-group">
                <label>Задачи (каждая с новой строки, от 3 до 5):</label>
                <textarea 
                    class="form-control"
                    v-model="newCardTasks" 
                    rows="5" 
                    placeholder="Задачи"
                    :disabled="isAddingBlocked"
                ></textarea>
            </div>
            
            <div v-if="newCardTasks.trim()" class="info-box">
                <strong>Количество задач:</strong> 
                {{ taskCount }}
                <span v-if="taskCount < 3" class="warning">(минимум 3)</span>
                <span v-if="taskCount > 5" class="warning">(максимум 5)</span>
            </div>
            
            <button 
                class="btn"
                @click="submitForm"
                :disabled="isAddingBlocked || isColumn1Full || !isValidForm"
            >
                Добавить карточку
            </button>
            
            <div v-if="isColumn1Full && !isAddingBlocked" class="warning">
                В первой колонке больше нет места (максимум 3)
            </div>
        </div>
    `,
    computed: {
        taskCount() {
            return this.newCardTasks
                .split('\n')
                .filter(t => t.trim()).length;
        },
        isValidForm() {
            return this.newCardTitle.trim() && 
                   this.taskCount >= 3 && 
                   this.taskCount <= 5;
        }
    },
    methods: {
        submitForm() {
            if (!this.isValidForm) {
                if (!this.newCardTitle.trim()) {
                    alert('Введите название карточки');
                } else if (this.taskCount < 3) {
                    alert('Минимальное количество задач - 3');
                } else if (this.taskCount > 5) {
                    alert('Максимальное количество задач - 5');
                }
                return;
            }
            
            this.$emit('add-card', {
                title: this.newCardTitle,
                tasks: this.newCardTasks
            });
            
            this.newCardTitle = '';
            this.newCardTasks = '';
        }
    }
}); 
let app = new Vue({
    el: '#app',
    data: {
        appName: 'Мои заметки',
        cards: []
    },
    
    mounted() {
        const savedCards = localStorage.getItem('cards');
        if (savedCards) {
            try {
                this.cards = JSON.parse(savedCards);
                console.log('Данные загружены');
            } catch (e) {
                console.error('Ошибка загрузки данных:', e);
            }
        }
    },
    
    methods: {
        saveToLocalStorage() {
            localStorage.setItem('cards', JSON.stringify(this.cards));
        },
        
        handleAddCard(cardData) {
            if (this.isAddingBlocked) {
                alert('Нельзя добавить карточку: первый столбец заблокирован');
                return;
            }
            
            const tasksList = cardData.tasks
                .split('\n')
                .filter(t => t.trim())
                .map(t => ({ text: t.trim(), completed: false }));
            
            this.cards.push({
                id: Date.now(),
                title: cardData.title,
                tasks: tasksList,
                column: 0,
                completionDate: null
            });
            
            this.saveToLocalStorage();
            console.log('Карточка добавлена!');
        },
        
        handleToggleTask({ cardId, taskIndex }) {
            const card = this.cards.find(c => c.id === cardId);
            if (!card) return;
            
            if (card.column === 0 && this.isColumn1Blocked) {
                alert('Первая колонка заблокирована! Нельзя отмечать задачи.');
                return;
            }
            
            card.tasks[taskIndex].completed = !card.tasks[taskIndex].completed;
            
            this.$nextTick(() => {
                this.checkAndMoveCard(card);
                this.saveToLocalStorage();
            });
        },
        
        handleDeleteCard(cardId) {
            if (confirm('Удалить карточку?')) {
                this.cards = this.cards.filter(c => c.id !== cardId);
                this.saveToLocalStorage();
                console.log('Карточка удалена');
            }
        },
        
        checkAndMoveCard(card) {
            const completedCount = card.tasks.filter(t => t.completed).length;
            const totalCount = card.tasks.length;
            const percentage = (completedCount / totalCount) * 100;
            
            if (card.column === 0 && percentage > 50) {
                if (this.column2Cards.length >= 5) {
                    console.log('❌ Перемещение заблокировано: во второй колонке нет места');
                    return;
                }
                
                console.log(`→ Карточка "${card.title}" перемещается в колонку 1`);
                card.column = 1;
                return;
            }
            
            if (card.column === 1 && percentage === 100) {
                console.log(`→ Карточка "${card.title}" перемещается в колонку 2`);
                card.column = 2;
                card.completionDate = new Date().toLocaleString();
            }
        }
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
        
        hasCardReadyToMoveFromColumn1() {
            return this.column1Cards.some(card => {
                const completedCount = card.tasks.filter(t => t.completed).length;
                const percentage = (completedCount / card.tasks.length) * 100;
                return percentage > 50 && percentage < 100;
            });
        },
        
        isColumn1Blocked() {
            return this.isColumn2Full && this.hasCardReadyToMoveFromColumn1;
        },
        
        isAddingBlocked() {
            return this.isColumn2Full && this.hasCardReadyToMoveFromColumn1;
        },
        
        totalCompletedTasks() {
            let total = 0;
            this.cards.forEach(card => {
                total += card.tasks.filter(t => t.completed).length;
            });
            return total;
        }
    },
    
    watch: {
        cards: {
            handler() {
                this.saveToLocalStorage();
            },
            deep: true
        }
    }
});