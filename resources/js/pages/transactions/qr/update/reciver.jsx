import React from 'react';

const Reciver = () => {
    return (
        <>
            <h1>Update</h1>
            <h2>reciver chooses amount page</h2>

            <form method="post" action="">
                <input name="amount" type="text" placeholder="Amount" />
                <button type="submit">send</button>
            </form>
        </>
    );
};

export default Reciver;
