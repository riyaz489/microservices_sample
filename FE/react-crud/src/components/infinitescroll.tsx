import { useEffect } from "react";

const InfiScroll = () =>{
     
// IntersectionObserver is used to observe certain element which are currently visible
// in the screen. 
// first argument is call back, which will be called whenever we change postion of our observed elem.
// IntersectionObserver contianer, and second argument is object(dict in python), which is used to tell use when to set isIntersecting  to True
// . if second argument is null then, isIntersecting will be True when current observing elem is visible in screen. (i.e default contianer size will be 100 vh and 100 vw) 
// note: this observer first callback is only called when our target element is present inside defined visible continaner.
// othrwise it will be just silent. observer.observe() method is just to register target dom element with this action. once element is visible then it will be called.
 
const observer = new IntersectionObserver(
        entries => {
            // entries could have have multiple, because multiple html tag can match our observer query
            const lastCard = entries[0]
            console.log(lastCard);
            // because it's a infinte loader, so this function is going to be a recursive function. that's why we are doing early return below.
            if (!lastCard.isIntersecting) return;
            
            // w will load new cards if we see last card in screen.
            loadNewCards()

            // removing observer from current last card
            // note: trget property will give us the actual html element
            observer.unobserve(lastCard.target);
            // adding new last crd to observer
            const new_last_card= document.querySelector('.card:last-child');
            if (new_last_card!= null){
                console.log(new_last_card);
            observer.observe(new_last_card);}
        },
        {   // threshold 1 means when observing elem is fully visible, similary 0.1 means when 10% of element is visible
            threshold: 1,
            // rootMargin: '100px'
            // rootmargin is used to increase/decrease defualt contianer size
            // for +ve value it will look observed elem for more 100px top and 100px bottom. and for -ve value
            // it will decrease search window size by 100px from top and bottom both

        }
    );
    var cardContaner:Element;



    useEffect( ()=>{
        const cont = document.querySelector('.card-contianer');
        if (cont)   cardContaner = cont; 

        
        const last_card = document.querySelector('.card:last-child');
        if (last_card!=null){
            // so here we are adding a list of elements which atch above query, 
            // but in our case it will be only one elem as we are looking for lat child only.
            // so whenever this elem position changed, above observer function will be called.
            // we need to call observe once dom is rendered that's why we called it inside useEffect.
            // any this useEffect will be called intially at once only, as after that we are not changin any prop or state.
        observer.observe(last_card);}
        
        
    }
    );




    function loadNewCards(){
        for (let i=0; i<10; i++){
            const card = document.createElement('div');
            card.textContent = 'new card'
            card.classList.add('card');
            // .? is optional chaing append() will only be called if cardContanier is not null
            cardContaner?.append(card);
        }
    }
    const x = [1,2,3,4,5,6,7,8]
    return (<div>

        <div className="card-contianer">
            {x.map((n:number) =>{ return (

                <div key={n.toString()} className="card"> card {n}</div>
            );} )}
        </div>
    </div>);

};

export default InfiScroll;