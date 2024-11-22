# Documentation for adding questions into backend

## Details of important JSONs involved

In this section, I will be writing down the structures of the JSONs involved in the entire process of using the `AddQuestionForm` and how they are used to display the questions onto the `QuestionPreview` (ie. their keys and how they are nested)

This part will be mostly focused on `questionLeafs`, `questionAnswer` and `questionContent` JSONs (an additional one will be the `markScheme`, which is the JSON being saved into the Question Table)

The description of the structure of these JSONs will begin with how they are collected as form values and how they are processed into their respective values

### `questionLeafs`

The final JSON value can be obtained as one of the attributes from the `questionContentCombinedJSON` which is being calculated in `QuestionPreview`.

This JSON is derived from the `questionParts` form field in the form.

`questionParts` will look something like:

```javascript
[
    {
        questionIdx: "",
        questionSubIdx: "",
        isText: true,
        text: ""
    },
    {
        questionIdx: "".
        questionSubIdx: "",
        isText:false,
        image: (image file)
    }
]
```

`questionIdx` has the following possible values: root, a, b, c, d ... z
`questionSubIdx` has the following possible: root, i, ii, iii, iv... x (`questionSubIdx` can only be root if questionIdx is root)

Hence, when being processed, the unique questionLeafs will be pulled out.

#### MCQ

When `questionType` is MCQ, `questionLeafs` can only be `null`, this is force set because in our design, MCQs will not have indexed parts. If there are indexed parts, separate them into their own individual MCQ questions.

#### OEQ

By sieving through the `questionParts` in the form and collecting a series of unique combinations of `questionIdx` and `questionSubIdx`, we will form our `questionLeafs` JSON structure.

The general structure will be something like this:

```javascript
{
    index1: [sub-index1, sub-index2, sub-index3],
    index2: [],
    ...
}
```

Hence, `questionLeafs` will look something like this:

```javascript
{
    a: ["i", "ii", "iii"],
    b: []
}
```

However, there are some nuances to this structure:

- If the array is _empty_ for a `questionIndex`, it means that the `questionLeaf` is questionIndex-root. For example, in `b:[]`, it means that the `questionLeaf` is `b-root` and there are no other `questionLeaf` with that questionIndex.
- If the array is _not empty_, it means that there is no `questionLeaf` with questionIndex-root.

If after sieving through `questionParts`, `questionLeafs` ends up being an empty object (which means that there are no indexed parts), it will be set as `null`

The values in the `questionLeafs` JSON are sorted in 2 different ways to ensure that it _accurately represents the overall structure_ of the question. Since `questionLeafs` will be used to help with displaying the `questionContent` and `questionAnswers`.

1. The `keys` in `questionLeafs` is sorted by _alphabetical_ order, e.g. index "a" will come before index "b" which will come before index "c"...
2. The sub-indexes stored in the arrays for the value of each `key` is _sorted by using a RomanToIntMap dictionary_, to sort them by _numerical_ value, hence "i" comes before "ii", which will be followed by "iii"....

### `questionContent`

As for `questionContent`, it is derived from the `questionParts` value in the form. IT DOES NOT CONTAIN THE ANSWERS TO THE QUESTIONS, that belongs in `questionAnswer`.

`questionContent` is being calculated out in the `QuestionPreview` component, by a helper function in `addQuestionUtils` file, to display the question content. It will also be the desired format to be saved into the database.

At the most surface-level of questionContent JSON there are 2 keys:

1. `root`: contains all the content of the question at the root of the question
2. `indexed` : contains all the information of the of the indexed parts of the question (e.g. (a)(i), (b)(ii))

Let's start off with an example of `questionContentCombined` (which includes both `questionContent` and `questionLeafs` ) JSON:

```javascript
questionContentCombinedJSON: {
  "questionContent": {
    "root": [
      {
        "isText": true,
        "content": "Choose from the following compounds to answer the questions.",
        "id": "86f3742d-bb04-433b-a542-3cf72340741c"
      },
      {
        "isText": true,
        "content": "Each compound may be used once, more than once or not at all",
        "id": "499ad7b9-d1d0-4ac7-bbdd-026107ad3234"
      },
      {
        "isText": true,
        "content": "state which compound",
        "id": "e60288ca-9b83-4944-82b6-84406f1d71c6"
      }
    ],
    "indexed": {
      "a": {
        "root": [
          {
            "isText": true,
            "content": "Reacts with dilute nitric acid to form a gas that produces white precipitate in limewater. ",
            "id": "6639ccc9-390f-49a4-9a3f-72259a1d7ce2"
          }
        ]
      },
      "b": {
        "root": [
          {
            "isText": true,
            "content": "reacts with warm aqueous sodium hydroxide...\n",
            "id": "61004ff0-c2a6-4ca4-9017-a901ee809e39"
          }
        ]
      },
      "c": {
        "root": [
          {
            "isText": true,
            "content": "contains an anion with a charge of -3",
            "id": "ff8c3daa-3ad8-40aa-a239-32217dff9b87"
          }
        ]
      },
      "d": {
        "i": [
          {
            "isText": true,
            "content": "is prepared using the method of precipitation reaction",
            "id": "20fc344a-0cf5-436e-87e1-685301335056"
          }
        ],
        "ii": [
          {
            "isText": true,
            "content": "is used to test for a reducing agent",
            "id": "6f608f94-253f-424c-b2a5-6e20bd79c31f"
          }
        ]
      }
    }
  },
  "questionLeafs": {
    "a": [],
    "b": [],
    "c": [],
    "d": [
      "i",
      "ii"
    ]
  }
}
```

This was gotten from the below `questionParts` value:

```javascript
[
  {
    questionIdx: "root",
    questionSubIdx: "root",
    order: "0",
    isText: true,
    text: "Choose from the following compounds to answer the questions.",
    id: "86f3742d-bb04-433b-a542-3cf72340741c",
  },
  {
    questionIdx: "root",
    questionSubIdx: "root",
    order: "0",
    isText: true,
    text: "Each compound may be used once, more than once or not at all",
    id: "499ad7b9-d1d0-4ac7-bbdd-026107ad3234",
  },
  {
    questionIdx: "root",
    questionSubIdx: "root",
    order: "0",
    isText: true,
    text: "state which compound",
    id: "e60288ca-9b83-4944-82b6-84406f1d71c6",
  },
  {
    questionIdx: "a",
    questionSubIdx: "root",
    order: "0",
    isText: true,
    text: "Reacts with dilute nitric acid to form a gas that produces white precipitate in limewater. ",
    id: "6639ccc9-390f-49a4-9a3f-72259a1d7ce2",
  },
  {
    questionIdx: "b",
    questionSubIdx: "root",
    order: "0",
    isText: true,
    text: "reacts with warm aqueous sodium hydroxide...\n",
    id: "61004ff0-c2a6-4ca4-9017-a901ee809e39",
  },
  {
    questionIdx: "c",
    questionSubIdx: "root",
    order: "0",
    isText: true,
    text: "contains an anion with a charge of -3",
    id: "ff8c3daa-3ad8-40aa-a239-32217dff9b87",
  },
  {
    questionIdx: "d",
    questionSubIdx: "i",
    order: "0",
    isText: true,
    text: "is prepared using the method of precipitation reaction",
    id: "20fc344a-0cf5-436e-87e1-685301335056",
  },
  {
    questionIdx: "d",
    questionSubIdx: "ii",
    order: "0",
    isText: true,
    text: "is used to test for a reducing agent",
    id: "6f608f94-253f-424c-b2a5-6e20bd79c31f",
  },
];
```

For `root`, the value will just be an array with objects with keys of `isText`, `id` (uuid), `content`. These keys will be present deeper into the JSON for the `indexed` key as well. `content` will be _text_ if `isText` is **true**, but will be a _file_ object if isText is **false**

For `indexed`, its value will be another object, that will have `keys` and `subKeys` that present all the possible `questionIdx` and `questionSubIdx` present in `questionParts`.
As can be seen, since in `questionParts`, there is an object with `questionIdx` of "**d**" and `questionSubIdx` of "**ii**", there will be a [...] value for indexed["d"]["ii"]

Steps to converting `questionPart` to `questionContent`:

1. Iterate through questionPart array: If questionIdx is _root_, `parseInt` the _order_ value and, push the object into the `questionContent["root"]` array. Else, check if `questionIdx` exists as a _key_ in `indexed`, if not, initialise an _object_ under it, then check if `questionSubIdx`(including "root" value) exists as a _key_ in `indexed`, if not then initialise an _array_ under it. Then `parseInt` the _order_ value and push it the `questionPart` object into the array

2. Sort the array values in the object according to the _order_ value in ascending order. Then **remove the order values from the object**.

#### Finalised `questionContent` for database

HOWEVER, the questionContent above will not be the finalised JSON that we will add into the database. The finalised JSON added to the database will have 1 huge difference: in the finalised JSON, instead of only having a single `content`. The finalised JSON will take the value in `content` and save it accordingly after processes into 1 of 2 attributes: `text` and `imgUrl`, depending on `isText`.

Hence, the final `questionContent` JSON will look something like:

```javascript
{
  "root": [
    {
      "isText": true,
      "text": "Choose from the following compounds to answer the questions.",
      "id": "86f3742d-bb04-433b-a542-3cf72340741c"
    },
    {
      "isText": true,
      "text": "Each compound may be used once, more than once or not at all",
      "id": "499ad7b9-d1d0-4ac7-bbdd-026107ad3234"
    },
    {
      "isText": true,
      "text": "state which compound",
      "id": "e60288ca-9b83-4944-82b6-84406f1d71c6"
    }
  ],
  "indexed": {
    "a": {
      "root": [
        {
          "isText": false,
          "imgUrl": [_imageUrl_],
          "id": "6639ccc9-390f-49a4-9a3f-72259a1d7ce2"
        }
      ]
    },
    "b": {
      "root": [
        {
          "isText": true,
          "text": "reacts with warm aqueous sodium hydroxide...\n",
          "id": "61004ff0-c2a6-4ca4-9017-a901ee809e39"
        }
      ]
    },
    "c": {
      "root": [
        {
          "isText": true,
          "text": "contains an anion with a charge of -3",
          "id": "ff8c3daa-3ad8-40aa-a239-32217dff9b87"
        }
      ]
    },
    "d": {
      "i": [
        {
          "isText": false,
          "imgUrl": [_imageUrl_],
          "id": "20fc344a-0cf5-436e-87e1-685301335056"
        }
      ],
      "ii": [
        {
          "isText": true,
          "text": "is used to test for a reducing agent",
          "id": "6f608f94-253f-424c-b2a5-6e20bd79c31f"
        }
      ]
    }
  }
}
```

### `questionAnswer`

In the form, the value for `questionAnswer` field will be one of 2 forms depending on if it is MCQ or OEQ `questionType`. Hence, I will be spliting this section into 2 sub-sections

#### MCQ

As for MCQ, the functionality implemented for the user is to be able to add `options` and also rearrange them. Each option will have a checkbox beside it to add itself to a `correctAnwers` array. Then there will be a save button for the user to set the value of `questionAnswer` in the form to the current state of options and correctAnswers.

There is also an input for the user to input marks. Hence, the `questionAnswer` **form field value** will look like this:

```javascript
[
  {
    options: ["a", "b", "c", "d"],
    answer: ["a", "b"],
    mark: "1",
  },
];
```

Currently, in the `QuestionPreview` component, the processing of this value is only involves extracting this singular object from this `array`.

Into:

```javascript
{
    "options": [
        "a",
        "b",
        "c",
        "d"
    ],
    "answer": [
        "a",
        "b"
    ],
    "mark": "1"
}
```

However, to save it into the database this is not enough. The **Question** table should have another field called `isMulti`, which can be true, false or null like a Big Boolean in Java.

If true, it means the current question is a **multi-choice** MCQ with more than 1 correct answer. If false, it means current question is a **singular-choice** MCQ with only 1 correct answer. This depends on the length of the array `answer`. (null is only for OEQ)

Hence, for multi-choice MCQs, the above processed JSON is sufficient, but for singular-choice MCQs, some alterations are needed. The below structure is desired:

```javascript
{
    "options": [
        "a",
        "b",
        "c",
        "d"
    ],
    "answer": "a",
    "mark": "1"
}
```

^ If the `answer` array **only** contains **1** option, then extract that option out and _turn the answer key's value into a string instead_.

#### OEQ

As for OEQ, let's take a look at an example of the structure of the value of `questionAnswer` in the form.

```javascript
[
  {
    questionIdx: "a",
    questionSubIdx: "root",
    answer: {},
    id: "93c0605a-088f-43c0-9580-595c774cefb4",
    isText: false,
    mark: "1",
  },
  {
    questionIdx: "b",
    questionSubIdx: "root",
    answer: "ANSWER",
    id: "19d13c19-0a14-428d-9101-8c9e0c0068a5",
    isText: true,
    mark: "2",
  },
  {
    questionIdx: "c",
    questionSubIdx: "root",
    answer: "ANSWER",
    id: "f9bf09fa-be75-4fda-b1ba-bfee526ea0a6",
    isText: true,
    mark: "2",
  },
  {
    questionIdx: "d",
    questionSubIdx: "i",
    answer: "ANSWER",
    id: "90440c86-6bb5-479b-87e9-43d8e23ede5d",
    isText: true,
    mark: "3",
  },
  {
    questionIdx: "d",
    questionSubIdx: "ii",
    answer: "ANSWER",
    id: "284387a5-cb40-4108-ad90-a2ad403a6fe3",
    isText: true,
    mark: "4",
  },
];
```

NOTE: `mark` has to be a string of a digit that is larger than 0
NOTE: For the first object, the value of `answer` is just `{}` because it is an image file.

So basically, the entire backbone of the questionAnswer value in the form is automatically calculated based on the questionLeafs of the question and the previous version of questionAnswer value (whether it already has a value for the corresponding questionIdx and questionIdx or whether it needs a reset)

And in QuestionPreview, this entire array is processed into the following JSON:

```javascript
{
    "a": {
        "root": {
            "answer": {},
            "isText": false,
            "mark": "1"
        }
    },
    "b": {
        "root": {
            "answer": "ANSWER",
            "isText": true,
            "mark": "2"
        }
    },
    "c": {
        "root": {
            "answer": "ANSWER",
            "isText": true,
            "mark": "2"
        }
    },
    "d": {
        "i": {
            "answer": "ANSWER",
            "isText": true,
            "mark": "3"
        },
        "ii": {
            "answer": "ANSWER",
            "isText": true,
            "mark": "4"
        }
    }
}
```

^ So as it can be seen, it will be processed into a similar structure as `questionContent`, where the object will have the `questionIdx` and `questionSubIdx` of the each `questionLeaf` (In this case, this is for the same `questionLeaf` as the one in the JSON above) as _key_ and _subKey_

The `keys` and `subkeys` in this object does not need to be in order because when displaying the question, it is highly likely that we only need the questionLeafs to access the answer values. BUT it is still desirable to _keep them in order_ because of **possible future extensibility**

##### Finalised `questionAnswer` JSON for database

When adding into the database, the `mark` attributes should be parsed into an integer. The image file should also be stored in supabase storage and a link to the images should be stored in the JSON, in a `imgUrl` attribute. Hence, the final version of the JSON should look like this:

```javascript
{
    "a": {
        "root": {
            "imgUrl": [image_Url] ,
            "isText": false,
            "mark": "1"
        }
    },
    "b": {
        "root": {
            "text": "ANSWER",
            "isText": true,
            "mark": "2"
        }
    },
    "c": {
        "root": {
            "text": "ANSWER",
            "isText": true,
            "mark": "2"
        }
    },
    "d": {
        "i": {
            "text": "ANSWER",
            "isText": true,
            "mark": "3"
        },
        "ii": {
            "text": "ANSWER",
            "isText": true,
            "mark": "4"
        }
    }
}
```

### Mark Scheme

In the Question table in the database, there is a markScheme field and it is to store the marks allocated to each of the question Leaf.

Hence for **OEQ**, using the above example it should look like this:

```javascript
{
    "a": {
        "root": 1
    },
    "b": {
        "root": 2

    },
    "c": {
        "root": 3
    },
    "d": {
        "i": 3
        "ii": 3
    }
}
```

^ the mark value should already be parsed into an **integer**

For **MCQ**, since there should be no indexed parts in an MCQ, `markScheme` will be `null`. Marks given to students will be calculated in a different way


## Naming convention for image files in storage

The name for image files should include most of the **paper metadata** as well, for *"foldering" and better identification* of the images. 

List of paper metadata collected:
1. year
2. educationLevel
3. school
4. subject
5. examType 

We will arrange the paper metadata in the image name in increasing specificity.

Also, since both `questionContent` and `questionAnswer` can include images, we will also further separate the image names by adding paths __content__ and __answer__.

To distinguish images within the same JSON, there will also be a `imageCount` variable being tracked when adding the images into the database. E.g. 0, 1, 2, 3, 4, 5...

Furthermore, to prevent being targetted by malicious actors, we will be **adding a `uuid` number to the name** of the image file as well. In the future, rate limiting techniques will also be explored. 

Now, we put everything together:
image file path: _[*year*]/[*educationLevel*]/[*school*]/[*subject*]/[*examType*]/[*content/answer*]/image_[*imageCount*]_[*uuid*]_