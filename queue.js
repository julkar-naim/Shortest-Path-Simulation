class Node{
    constructor(value){
        this.value = value;
        this.next = null;
    }
}

class Queue{
    constructor(){
        this.front = null;
        this.rear = null;
        this.size = 0;
    }

    enque(item){
        const node = new Node(item);

        if(this.front){
            this.rear.next = node;
            this.rear = node;
        }
        else{
            this.rear = node;
            this.front = node;
        }
        this.size++;
    }
    deque(){
        const cur = this.front;
        this.front = this.front.next;
        this.size--;
        return cur.value;
    }
    isEmpty(){
        return this.size === 0;
    }
    Size(){
        return this.size;
    }
}

export default Queue;


// let q = new Queue();

// q.enque({x:324, y: 234});
// q.enque({x:324, y: 234});
// q.enque({x:324, y: 234});

// while(!q.isEmpty()){
//     console.log(q.deque());
// }

