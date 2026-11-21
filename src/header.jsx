import logo from "./logo.png"
export default function Header(){
    return(
        <>
            <header className="header">
                <img src={logo} alt="chef claude logo" />
                <h1>Chef Claude</h1>
            </header>
        </>
    )
}