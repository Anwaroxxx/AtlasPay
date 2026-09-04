import React from 'react';

const Store = () => {
    return (
        <>
            <h1>Update</h1>
            <h2>Store page</h2>
            <h3>sender chooses amount page</h3>

            <form method="post" action="">
                <input name="amount" type="text" placeholder="Amount" />
                <button type="submit">send</button>
            </form>
        </>
    );
};

export default Store;
