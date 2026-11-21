// The Gemini key now lives on the server (api/recipe.js), not in this file.
export async function getRecipeFromClaude(ingredientsArr) {
    const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredientsArr }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return data.recipe
}