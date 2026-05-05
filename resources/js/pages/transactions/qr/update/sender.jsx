import { usePage } from "@inertiajs/react";
import React from "react";


const Sender = (props)=>
{
    console.log(
 window.location.origin+`/qr/update/sender/`+props.id )
    return(
        <>
            <h1>Update</h1>
            <h2>sender chooses amount page</h2>


            <form method="post" action={ window.location.origin+`/qr/update/sender/`+props.id}>
                <input name="amount" type="text" placeholder="Amount" />
                <button type="submit">send</button>
            </form>
        </>
    )
}


export default Sender;