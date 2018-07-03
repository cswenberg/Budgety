

// data module
var budgetController = (function() {

	var Item = function(id, des, val) {
		this.id = id
		this.description = des
		this.value = val
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
			total: 0
		}
	}

	var updateBudget = function() {
		var newBudget = document.querySelector(DOM.income).value + document.querySelector(DOM.expenses).value
		console.log(newBudget)
	}

	return {
		//All publicly available methods as attribute of return object
		addItem: function(type, description, value) {
			var num
			if (type == 'income') {
				num = Number(value)
			} else if (type == 'expense') {
				num = value * -1
			}
			var id
			if (data[type].list.length == 0) {id = 0}
			else {id = data[type].list[data[type].list.length-1].id+1}
			var item = new Item(id, description, num)

			data[type].list.push(item)
			data[type].total += item.value
			console.log(data)

			//updateBudget()
		}

	}
})()


// ui module
var uiController = (function() {

	var DOM = {
		type: '.add__type',
		description: '.add__description',
		value: '.add__value',
		button: '.add__btn'
	}



	return {
		//All publicly available methods as attribute of return object
		DOM: DOM,
		getInputs: function() {
			return {
				type: document.querySelector(DOM.type).value,
				description: document.querySelector(DOM.description).value,
				value: document.querySelector(DOM.value).value,
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
	}


	var addItem = function() {

		var inputs = ui.getInputs()

		budget.addItem(inputs.type, inputs.description, inputs.value)

	}

	return {
		//All publicly available methods as attribute of return object
		init: function() {
			createListeners()
		}

	}

})(budgetController, uiController)


controller.init()
























