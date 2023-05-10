# Introduction

Welcome, this is my attempt at trying to find patterns, similarities or anything weirdly of interest: from earnings calls. The domain of finance intrigues me, hence I've taken call transcripts from top US banks. For the quest, I've thrown everything at the dataset, from traditional ML to SOTA NLP.

This project also serves as my thesis presentation for `Visualization for Machine Learning class @ NYU`.

# Data

I have taken Earnings Call transcript data for top banks in US, for the first quarter of 2023. Data was sourced from [seekingalpha.com](https://seekingalpha.com/). I simply typed on Google: `largest banks in US`, Wikipedia gave some answer, it was based on old data, I chose to go along with it.

These are the banks considered for the analysis:

| Symbol | Bank Name | Extra |
| :---: | :---: | :---: |
| JPM | JPMorgan Chase | New York City |
| BAC | Bank of America | Charlotte, North Carolina |
| C | Citigroup | New York City |
| WFC | Wells Fargo | San Francisco |
| GS | Goldman Sachs | New York City |
| MS | Morgan Stanley | New York City |
| USB | U.S. Bancorp | Minneapolis |
| PNC | PNC Financial Services | Pittsburgh |
| TFC | Truist Financial | Charlotte, North Carolina |
| TD | TD Bank, N.A. | Cherry Hill, New Jersey |
| COF | Capital One | McLean, Virginia |

# Model

I have employed the FinBERT model, from authors Huang et al.
+ [Link to paper](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3910214)
+ [Link to HuggingFace Model Card](https://huggingface.co/yiyanghkust/finbert-tone)
+ [Link to Model GIT](https://github.com/yya518/FinBERT)

As for why I chose this model? Well frankly, there aren't any other good fine-tunes models in the Finance domain. Quoting from their Hugging Face model card page:


>FinBERT is a BERT model pre-trained on financial communication text. The purpose is to enhance financial NLP research and practice. It is trained on the following three financial communication corpus. The total corpora size is 4.9B tokens.
>1. Corporate Reports 10-K & 10-Q: 2.5B tokens
>2. Earnings Call Transcripts: 1.3B tokens
>3. Analyst Reports: 1.1B tokens

>This released finbert-tone model is the FinBERT model fine-tuned on 10,000 manually annotated (positive, negative, neutral) sentences from analyst reports. This model achieves superior performance on financial tone analysis task. If you are simply interested in using FinBERT for financial tone analysis, give it a try.


# Project Structure

```shell
.
├── README.md
├── d3js_javascript_files
│   ├── vis_box_plot.js
│   ├── vis_bubble_chart.js
│   ├── vis_grouped_bar_chart.js
│   ├── vis_pie_charts.js
│   ├── vis_simple_bar_charts.js
│   └── vis_small_multiple_area_chart.js
├── project.ipynb
├── requirements.txt
├── transcript_data
│   ├── bac.txt
│   ├── c.txt
│   ├── cof.txt
│   ├── gs.txt
│   ├── jpm.txt
│   ├── ms.txt
│   ├── pnc.txt
│   ├── td.txt
│   ├── tfc.txt
│   ├── usb.txt
│   └── wfc.txt
└── visualizations
    ├── viz_number_of_characters.png
    ├── viz_number_of_sentences.png
    ├── viz_number_of_words.png
    ├── viz_parts_of_transcript_boxplot.png
    ├── viz_prefix_sum_sentiments.png
    ├── viz_sentiment_counts.png
    ├── viz_top_10_words_by_frequency.png
    └── viz_top_10_words_by_tfidf.png
```

+ `d3js_javascript_files`: contains all JS files which contain code to create visualizations in D3JS
+ `project.ipynb`: Main Jupyter Notebook which contains all code
+ `transcript_data`: Source data for the project, each file contains earnings calls transcripts from 1st Quarter of 2023
+ `visualizations`: Contains all visualizations created for the analysis
+ `requirements.txt`: Contains all Python dependencies for the project

# How to?

Here are the steps you can do to get the code working:

+ Clone this repository
+ Create a Python virtual environment with the command: `python3 -m venv env` (depends from system to system)
+ Install all dependencies with this command: `pip install -r requirements.txt`
+ Launch JupyterLab with the command: `jupyter lab`
+ The notebook should be up and running, happy coding!


# References

+ [FinBERT paper](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3910214)
+ [FinBERT HuggingFace Model Card](https://huggingface.co/yiyanghkust/finbert-tone)
+ [FinBERT Model GIT](https://github.com/yya518/FinBERT)
+ [Datasource SeekingAplha](https://seekingalpha.com/)
+ [NYU Visualization Observable](https://observablehq.com/@nyuvis)
+ [stackoverflow.com](https://stackoverflow.com/)
+ [List of largest banks in the United States](https://en.wikipedia.org/wiki/List_of_largest_banks_in_the_United_States)

# Acknowledgments

I wish to extend my deepest gratitude to Professor Dr. Claudio Silva and the wonderful TAs at Visualization for Machine Learning Class @ NYU. I thank the authors of FinBERT for their research, publishing the models on HuggingFace and exposing great documentations. I also thank seekingalpha.com for curating the transcripts data in an easily accessible form. Kudos to [NYU Visualization Observable](https://observablehq.com/@nyuvis) creators and maintainers, who exposed so many template D3JS codes for various visualizations.