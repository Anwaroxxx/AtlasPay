import React from "react";


const Store = ()=>
{
    return(
        <>
            <h1>Store page</h1>
            <h2>sender chooses amount page</h2>


            <form method="post" action="">
                <input name="amount" type="text" placeholder="Amount" />
                <button type="submit">send</button>
            </form>
        </>
    )
}


export default Store;