from transformers import pipeline

generator = pipeline(
    "text-generation",
    model="gpt2"
)

def generate_story(action):

    prompt = f"""
    Player Action:
    {action}

    Story:
    """

    result = generator(
        prompt,
        max_length=150,
        num_return_sequences=1
    )

    return result[0]['generated_text']