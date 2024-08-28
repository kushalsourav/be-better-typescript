console.log('hell oworld')

window.stream = {}

const initialData = {
    clients: []
}


window.addEventListener('message' , (e) => {
   console.log(e.data)
})