;(function(){
	var filters = {
		all: function (todos) {
			return todos;
		},
		active: function (todos) {
			return todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		completed: function (todos) {
			return todos.filter(function (todo) {
				return todo.completed;
			});
		}
	};

	var todos = JSON.parse(window.localStorage.getItem('todos'));
	var app = new Vue({
		el: '#app',
		data: {
			message: 'todolist',
			todos,
			editingId: 0,
			filterText: 'all'
		},
		methods: {
			addToDoKeyDown (e) {
				let value = e.target.value.trim();
				let todos = this.todos;
				todos.push({
					id: todos.length ? todos[todos.length - 1].id + 1 : 1,
					thing: value,
					completed: false
				});
				e.target.value = '';

				window.localStorage.setItem('todos', JSON.stringify(todos));
			},

			deleteOne (index) {
				this.todos.splice(index,1);
			},

			edit (id) {
				this.editingId = id;
			},

			enterToEdit (index, e) {
				//修改todos数据
				//修改输入框样式
				//如果输入为空，直接删除数据
				this.todos[index].thing = e.target.value;
				this.editingId = 0;
				if (e.target.value === '') {
					this.todos.splice(index,1);
				}
			},

			cancelEditEsc () {
				this.editingId = 0;
			},

			clearCompleted () {
				//在遍历数组时，如果要删除数组元素，一定要将i减一
				for (let i=0; i<this.todos.length; i++){
					if(this.todos[i].completed){
						this.todos.splice(i,1);
						i--;
					}
				}
			}
		},
		watch: {
			todos: {
				handler: function(){
					window.localStorage.setItem('todos', JSON.stringify(this.todos));
				},
				deep: true       //深度监视，一般用于对象的监视
			}
		},
		computed: {                  
			//计算属性类似于函数，但计算出值后直接调用值，不会重复调用函数（修改数据除外）
		    allLeftThings: function () {
		    	let leftThingsNumber = 0;
			    for (item of todos){
			    	if (!item.completed)
			    		leftThingsNumber++;
			    }
			    return leftThingsNumber;
		    },
		    toggleAll: {     
		    	//计算属性有几个内置函数，包括get，set等，如果只有一个函数则默认是get函数
		    	//set函数可以设置计算属性的值
		    	//这里运用get检测是否todo全部完成，实现toggle-all的切换
		    	//用set监听toggle-all的切换,改变todo样式
		    	get(){
		    		if (this.todos !== null) {
		    			return this.todos.every(t => t.completed);
		    		}
		    		return null;
		    	},
		    	set(){
		    		let check = !this.toggleAll;
		    		for(item of todos){
		    			item.completed = check;
		    		}
		    	}
		    },
			filteredTodos: function () {
				return filters[this.filterText](this.todos);
			},
	    }
	});
	window.onhashchange = function () {
		if (window.location.hash.substr(2) == '') {
			app.filterText = 'all';
		} else {
			app.filterText = window.location.hash.substr(2);
		}
	}

})()