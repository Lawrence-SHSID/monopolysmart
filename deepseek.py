# Please install OpenAI SDK first: `pip3 install openai`

from openai import OpenAI

client = OpenAI(api_key="sk-4f71f7b2b6c246f0a6392acae42c0ed1", base_url="https://api.deepseek.com")

def call_deepseek(prompt, model="deepseek-chat", max_tokens=2000, temperature=0.7):
    """
    调用DeepSeek API (使用OpenAI SDK风格)
    
    参数:
        prompt: 输入的提示文本
        model: 使用的模型(default: deepseek-chat)
        max_tokens: 最大生成token数(default: 1000)
        temperature: 生成温度(default: 0.7)
    
    返回:
        API响应内容
    """
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant"},
                {"role": "user", "content": prompt},
            ],
            max_tokens=max_tokens,
            temperature=temperature,
            stream=False
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"API调用错误: {e}")
        return None

# 使用示例
if __name__ == "__main__":
    test_prompt = "could u gimme 25 facts bout minecraft?"
    result = call_deepseek(test_prompt)
    
    if result:
        print("API响应:")
        print(result)
    else:
        print("API调用失败")