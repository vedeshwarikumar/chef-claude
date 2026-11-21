export default function RecipeContainer(props) {
    return (
        <div className="recipe-container">
            <div>
                <h3>Are you ready to get the recipe?</h3>
                <p>Click here to get the recipe that matches your ingredients</p>
            </div>
            <div>
                <button onClick={props.onGetRecipe} disabled={props.loading}>
                    {props.loading ? "Getting recipe..." : "Get recipe"}
                </button>
            </div>
        </div>
    )
}