import React from 'react';
import '../css/Sandbox.css';
import { useRef, useEffect } from 'react';
import { initializeCanvas } from '../scripts/view_sandbox.js';

export default function Sandbox() {

    const canvas_ref = useRef(null);

    const parsed_pdf = {
        "Quantum Mechanics": {
            description: "Study of physical phenomena at nanoscopic scales",
            children: ["Quantum State", "Electric Field", "Hydrogen Atom"]
        },
        "Quantum State": {
            description: "A mathematical description of a quantum system",
            children: ["Orthogonality", "Different Quantum States", "Wave Function"]
        },
        "Electric Field": {
            description: "A field surrounding charged particles, influencing force",
            children: ["Dipole", "Laser Interactions"]
        },
        "Hydrogen Atom": {
            description: "The simplest atom with one proton and one electron",
            children: ["Different Quantum States", "Laser Interactions"]
        },
        "Orthogonality": {
            description: "Property where two functions are orthogonal in inner product space",
            children: []
        },
        "Different Quantum States": {
            description: "Various possible energy levels of an electron in an atom",
            children: []
        },
        "Wave Function": {
            description: "Mathematical function describing quantum states",
            children: []
        },
        "Dipole": {
            description: "A system of two equal and oppositely charged or magnetized poles",
            children: []
        },
        "Laser Interactions": {
            description: "Interaction of laser fields with atomic or molecular systems",
            children: []
        }
    };

    useEffect(() => {

        const canvas = canvas_ref.current;
        initializeCanvas(canvas, parsed_pdf);

    }, [])

    return (
        <div>
            <canvas 
                ref={canvas_ref}
                style={{
                    display: "block",
                    width: "100vw",
                    height: "100vh",
                }}
            />
        </div>
    )
}
