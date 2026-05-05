import React from "react";


const Sender = ()=>
{
    return(
        <>
            <h1>sender chooses amount page</h1>


            <form method="post" action="">
                <input name="amount" type="text" placeholder="Amount" />
                <button type="submit">send</button>
            </form>
        </>
    )
}


export default Sender;