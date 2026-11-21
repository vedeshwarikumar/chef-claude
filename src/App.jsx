import React from "react";
import Header from "./header";
import IngredientsForm from "./ingredientsForm";
import RecipeContainer from "./recipeContainer";
import Recipe from "./recipe";
import { getRecipeFromClaude } from "./ai";

const RECENT_KEY = "recentIngredients"
const MAX_RECENT = 8

function loadRecent() {
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY)) || []
    } catch (e) {
        return []
    }
}

export default function App() {
    const [ingredients, setIngredients] = React.useState([])
    const [recentIngredients, setRecentIngredients] = React.useState(loadRecent)
    const [recipe, setRecipe] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    React.useEffect(() => {
        try {
            localStorage.setItem(RECENT_KEY, JSON.stringify(recentIngredients))
        } catch (e) {
            // storage not available, recents just won't be remembered
        }
    }, [recentIngredients])

    function deleteIngredient(event, indexToDelete) {
        event.preventDefault() // stops the browser's normal right-click menu
        setIngredients((prev) => prev.filter((_, index) => index !== indexToDelete))
    }

    const ingredientsList = ingredients.map((item, index) => (
        <li
            key={index}
            onContextMenu={(event) => deleteIngredient(event, index)}
            title="Right-click to delete"
        >
            {item}
        </li>
    ))

    // Only suggest recent ingredients that are not already in the current list
    const suggestions = recentIngredients.filter(
        (recent) => !ingredients.some((i) => i.toLowerCase() === recent.toLowerCase())
    )

    function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const newIngredient = formData.get("ingredient").trim()
        if (!newIngredient) return
        setIngredients((prev) => [...prev, newIngredient])
        setRecentIngredients((prev) =>
            [
                newIngredient,
                ...prev.filter((i) => i.toLowerCase() !== newIngredient.toLowerCase()),
            ].slice(0, MAX_RECENT)
        )
        event.currentTarget.reset();
    }

    async function getRecipe() {
        setLoading(true)
        setError("")
        try {
            const recipeText = await getRecipeFromClaude(ingredients)
            setRecipe(recipeText)
        } catch (err) {
            console.error(err)
            setError("Could not get a recipe. Check your API key and try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Header />
            <main>
                <IngredientsForm onSubmit={handleSubmit} suggestions={suggestions} />
                <ul className="ingredients-list">{ingredientsList}</ul>
                {ingredients.length > 0 && (
                    <p className="hint">
                        {ingredients.length <= 3
                            ? `Add ${4 - ingredients.length} more to get a recipe. `
                            : ""}
                        Right-click an ingredient to remove it.
                    </p>
                )}
                {ingredients.length > 3 && (
                    <RecipeContainer onGetRecipe={getRecipe} loading={loading} />
                )}
                {error && <p className="error">{error}</p>}
                {recipe && <Recipe recipe={recipe} />}
            </main>
        </>
    )
}