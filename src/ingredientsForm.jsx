export default function IngredientsForm(props) {
    const suggestions = props.suggestions || []

    return (
        <>
            <h2>Ingredients you have</h2>
            <p className="intro">
                Add four or more and Chef Claude will suggest a recipe.
            </p>
            <form className="ingredient-form" onSubmit={props.onSubmit}>
                <input
                    type="text"
                    placeholder="Eg: Tomatoes"
                    name="ingredient"
                    aria-label="Ingredient"
                    list="recent-ingredients"
                    autoComplete="off"
                />
                <datalist id="recent-ingredients">
                    {suggestions.map((item) => (
                        <option key={item} value={item} />
                    ))}
                </datalist>
                <button>+ Add</button>
            </form>
        </>
    )
}