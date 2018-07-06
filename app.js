

// data module
var budgetController = (function() {

	var Item = function(id, desc, val) {
		this.id = id
		this.description = desc
		this.value = val
		this.percentage = -1
	}

	Item.prototype.calculatePercentage = function() {
		if (data.income.total > 0) {
			this.percentage = Math.round(100 * this.value / data.income.total)
		} else {this.percentage = -1}
	}

	Item.prototype.getPercentage = function() {
		return this.percentage
	}

	var DOM = {
		budget: '.budget__value',
		income: '.budget__income--value',
		expenses: '.budget__expenses--value',
		expensePercentage: '.budget__expenses--percentage'
	}

	var data = {
		income: {
			list: [],
			total: 0
		},
		expense: {
			list: [],
			total: 0,
			percentage: 0
		},
		budget: 0

	}

	var updateBudget = function() {
		
	}

	return {
		//All publicly available methods as attribute of return object
		addItem: function(type, description, value) {
			var id

			if (data[type].list.length == 0) {id = 0}
			else {id = data[type].list[data[type].list.length-1].id+1}
			var item = new Item(id, description, value)

			data[type].list.push(item)
			data[type].total += item.value
			//console.log(data)
			return item
		},

		deleteItem: function(type, id) {
			var ids = data[type].list.map(function(current) {
				return current.id
			})
			var index = ids.indexOf(id)
			if (index != -1) {
				var item = data[type].list[index]
				data[type].list.splice(index, 1)
				data[type].total -= item.value
			}
		},

		updateBudget: function() {
			data.budget = data.income.total - data.expense.total
			if (data.income.total>0) {
				data.expense.percentage = Math.round(100 * data.expense.total / data.income.total)
			} else {data.expense.percentage = -1}
		},

		getBudget: function() {
			return {
				income: data.income.total,
				expenses: data.expense.total,
				budget: data.budget,
				percentage: data.expense.percentage
			}
		},

		updatePercentages: function() {
			data.expense.list.forEach(function(item) {
				item.calculatePercentage()
			}
		},

		getPercentages: function() {
			var all = data.expense.list.map(function(each) {
				return each.percentage
			})
			return all
		}

		testing: function() {
			return data
		}
	}
})()


// ui module
var uiController = (function() {

	var DOM = {
		type: '.add__type',
		description: '.add__description',
		value: '.add__value',
		button: '.add__btn',
		incomeList: '.income__list',
		expensesList: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container'
	}



	return {
		//All publicly available methods as attribute of return object
		DOM: DOM,
		getInputs: function() {
			return {
				type: document.querySelector(DOM.type).value,
				description: document.querySelector(DOM.description).value,
				value: parseFloat(document.querySelector(DOM.value).value)
			}
		},
		addItem: function(obj, type) {
			var html, list
			if (type == 'income') {
				list = DOM.incomeList
				html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"> </i></button> </div> </div> </div>'
				html = html.replace('%value%', '+ ' + obj.value)
			} else if (type == 'expense') {
				list = DOM.expensesList
				html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">%percentage%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"> </i></button> </div> </div> </div>';
				html = html.replace('%value%', '- ' + obj.value)
				html = html.replace('%percentage%', obj.percentage + '%')
			}
			//populate placeholders with object's actual data
			html = html.replace('%id%', obj.id) 
			html = html.replace('%description%', obj.description)

			document.querySelector(list).insertAdjacentHTML('beforeend', html) //input this html text at the end of the income or expenses list block
		},

		deleteItem: function(itemID) {
			var element = document.getElementById(itemID)
			element.parentNode.removeChild(element)
		},

		// updateItem: function(itemID) {
		// 	var element = document.getElementById(itemID)
		// 	element.querySelector('item__percentage').textContent = 
		// }

		resetFields: function() {

			var fields = document.querySelectorAll(DOM.description+', '+DOM.value) //returns a list of elements, not an array

			var array = Array.prototype.slice.call(fields) //forces call of Array's method slice on our list fields to return an array of elements

			array.forEach(function(element) {
				element.value = '' //sets element's text value to empty string to clear it
			})

			array[0].focus() //puts cursor back on DOM.description
		},

		displayBudget: function(obj) {
			var budg
			if (obj.budget>0) {budg = '+ ' + obj.budget} 
			else if (obj.budget<0) {budg = '- ' + Math.abs(obj.budget)}
			else {budg = 0}
			document.querySelector(DOM.budgetLabel).textContent = budg
			document.querySelector(DOM.incomeLabel).textContent = '+ ' + obj.income
			document.querySelector(DOM.expensesLabel).textContent = '- ' + obj.expenses
			if (obj.percentage>0) {
				document.querySelector(DOM.percentageLabel).textContent = obj.percentage + '%'
			} else {
				document.querySelector(DOM.percentageLabel).textContent = '---'
			}

		}


	}
})()



// controller module
var controller = (function(budget, ui) {

	var createListeners = function() {

		var DOM = ui.DOM

		document.querySelector(DOM.button).addEventListener('click', addItem)
		document.addEventListener('keypress', function(event) { //event passes a KeyPressedEvent
			if (event.keyCode === 13 || event.which === 13) { //checks if the key pressed was 'enter', depending on host software will use .keyCode or .which
				addItem()
			}
		})
		document.querySelector(DOM.container).addEventListener('click', deleteItem)
	}

	var addItem = function() {
		//gather fields
		var inputs = ui.getInputs()

		if (inputs.description!='' && !isNaN(inputs.value) && inputs.value>0) {
			//create new item
			var item = budget.addItem(inputs.type, inputs.description, inputs.value)
			//display new item on ui
			ui.addItem(item, inputs.type)
			//recalculate percentages of existing elements (if necessary)
			budget.updatePercentages()
			//clear input values and refocus cursor 
			ui.resetFields()
			//update budget and display on ui
			updateBudget()
			if (inputs.type == 'income') {
				updatePercentages()
			}
		}
	}

	var deleteItem = function(event) {

		var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
		if (itemID) {
			var split = itemID.split('-')
			var type = split[0]
			var id = parseInt(split[1])

			budget.deleteItem(type, id)
			ui.deleteItem(itemID)
			updateBudget()
			if (type == 'income') {
				updatePercentages()
			}
		}
	}

	var updateBudget = function() {
		budget.updateBudget()
		var newBudget = budget.getBudget()
		ui.displayBudget(newBudget)
	}

	var updatePercentages = function() {
		budget.updatePercentages()
		var newPercentages = budget.getPercentages()
		ui.displayPercentages(newPercentages)
	}

	return {
		//All publicly available methods as attribute of return object
		init: function() {
			createListeners()
			ui.displayBudget({
				income: 0,
				expenses: 0,
				budget: 0,
				percentage: -1
			})
		}

	}

})(budgetController, uiController)


controller.init()
























