import { Link } from "react-router-dom"
import Button from "../../components/Button"

import help_map from "../../assets/help_page_images/help_map.jpg"
import help_input from "../../assets/help_page_images/help_input.jpg"

const HowToAddSpot = () => {

    return (
        <div className = {`${''} container-medium mx-auto p-lg-5 p-4`}>

            <h1 className = "text-center mt-lg-5 mt-2 mb-5 fs-1 pt-4 fw-900">Jak správně přidat spot?</h1>
            

            <div className = "content fw-500 fs-4">
            {/* style = {{listStyle: "lower-roman"}} */}
                <ol>
                    <li className = "mb-3">
                        vymysli co nejtrefnější název, zařaď kategorii a přidej popis. Město bez PSČ
                    </li>
                    <li>
                        <ol style = {{listStyle: 'lower-alpha', listStylePosition: 'inside'}}>
                            <li className = "mb-3">
                                najdi místo na Google Mapách
                            </li>
                            <li className = "mb-3">
                                pravým klikem na mapu zobrazíš možnosti a poté klikni na souřadnice jako na obrázku 
                                <img src = {help_map} alt = "help with Google Map" className = "img-fluid w-100 mt-4"  style = {{border: '1px solid #b5b5ff', borderRadius: '8px'}} />
                            </li>
                            <li className = "mb-3">
                                vlož do prvního pole
                                <img src = {help_input} alt = "help with input fields" className = "img-fluid w-100 mt-4" style = {{border: '1px solid #b5b5ff', borderRadius: '8px'}}  />
                            </li>
                        </ol>
                    </li>
                    <li className = "mb-3">
                        přidej obrázky, můžeš označit až 3
                    </li>
                </ol>
            </div>

            <p className = "fw-800 mt-5 fs-3 text-center">Spot jde po přidání upravovat, neboj že bys zadal něco špatně. 
            Budem rádi, když po čase přidáš aktuální fotky. </p>

            <Link to = "/add-place">
                <Button variant = "primary" className = "fs-4 fw-700 d-block mx-auto my-5">přidat spot</Button>
            </Link>

        </div>
    )
}

export default HowToAddSpot