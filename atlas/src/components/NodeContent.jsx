import React, { createContext } from 'react';

export default function NodeContent({title, content}) {
    const [contentText, setContentText] = React.useState(content); // Why do I have to add code to make basic HTML features work as intended in React?
    return (
        <span hidden id="node-content-bubble" class="node-content">
            <span id="popup-bg" onClick={()=>{document.getElementById("node-content-bubble").hidden = true}}></span>
            <div>
                <h1>Edit content for: <strong onClick={()=>{alert("Please use the Node inspector in the toolbar to edit this (for now.)")}} id="node-content-title"></strong></h1>
                <textarea id="node-content-text" onChange={(e)=>{setContentText(e.target.value)}} name="nodeContentBox" rows="6" cols="35" placeholder="Enter node content..." value={contentText}></textarea>
                <img id="node-image"></img>
                <label id="node-content-image-label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="node-content-image">Upload image</label>
                <input type="file" id="node-content-image" class="block w-full text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" accept="image/png, image/jpeg"></input>

            </div>
        </span>
    );
}