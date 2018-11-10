import Component from './Component'

export default class DeleteTodo extends Component {
  constructor (dispatch, element, index) {
    super(dispatch, element)

    this.index = index

    element.addEventListener('click', this.onClick.bind(this))
    element.classList.add('destroy')
  }

  onClick (event) {
    this.dispatch({
      type: 'DELETE_TODO',
      index: this.index
    })
  }
}