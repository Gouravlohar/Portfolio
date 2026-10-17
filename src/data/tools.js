export const tools = [
  { name: "Python", image: "Python.png", category: "Data & machine learning" },
  { name: "NumPy", image: "NumPy.png", category: "Data & machine learning" },
  { name: "Pandas", image: "Pandas.png", category: "Data & machine learning" },
  {
    name: "Matplotlib",
    image: "Matplotlib.png",
    category: "Data & machine learning",
  },
  {
    name: "Scikit-Learn",
    image: "scikit-learn.png",
    category: "Data & machine learning",
  },
  {
    name: "TensorFlow",
    image: "tensorflow.png",
    category: "Data & machine learning",
  },
  {
    name: "PyTorch",
    image: "pytorch.png",
    category: "Data & machine learning",
  },
  { name: "Keras", image: "Keras.png", category: "Data & machine learning" },
  { name: "OpenCV", image: "OpenCV.png", category: "Data & machine learning" },
  {
    name: "LangChain",
    image: "langchain.png",
    category: "LLMs & generative AI",
  },
  { name: "Gemini", image: "gemini.png", category: "LLMs & generative AI" },
  { name: "Llama", image: "meta.png", category: "LLMs & generative AI" },
  {
    name: "Replicate",
    image: "replicate.png",
    category: "LLMs & generative AI",
  },
  {
    name: "Flask",
    image: "Flask.png",
    invertOnDark: true,
    category: "Applications & databases",
  },
  { name: "Django", image: "Django.png", category: "Applications & databases" },
  {
    name: "Streamlit",
    image: "stramlit.png",
    category: "Applications & databases",
  },
  { name: "MySQL", image: "MySQL.png", category: "Applications & databases" },
  { name: "SQLite", category: "Applications & databases" },
  { name: "Azure", image: "azure.png", category: "Cloud & deployment" },
  {
    name: "Google Cloud",
    image: "google-cloud.svg",
    category: "Cloud & deployment",
  },
  { name: "Render", image: "render.png", category: "Cloud & deployment" },
  { name: "Git", image: "Git.png", category: "Developer tools" },
  {
    name: "GitHub",
    image: "GitHub.png",
    invertOnDark: true,
    category: "Developer tools",
  },
  { name: "Jupyter", image: "Jupyter.png", category: "Developer tools" },
  { name: "Anaconda", image: "Anaconda.png", category: "Developer tools" },
  { name: "PyCharm", image: "PyCharm.png", category: "Developer tools" },
  { name: "VS Code", image: "Visual.png", category: "Developer tools" },
];

export const toolGroups = [...new Set(tools.map((tool) => tool.category))].map(
  (name) => ({
    name,
    tools: tools.filter((tool) => tool.category === name),
  }),
);
