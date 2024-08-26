// Each question has 2 portions: the Intro and the questionRoot
/*
const exampleOEQQuestionObject = {
    intro: [
        {
            isText: true,
            text: ""
        },
        {
            isText: false,
            imgUrl: ""
        }
    ],
    questionRoot:{
        content: [{isText:true , text: ""}, {isText: false, imgUrl:""}],
        children:{
            a: {
                content: [{isText:true , text: ""}, {isText: false, imgUrl:""}],
                children: {
                    i:{
                        content: [{isText:true , text: ""}, {isText: false, imgUrl:""}]
                        topics: [] //this will be an array of topic IDs
                        marks: 1, // Number of marks for this one question
                        answer: " "
                    },
                    ii:{
                        content: [{isText:true , text: ""}, {isText: false, imgUrl:""}]
                        topics: [] //this will be an array of topic IDs
                        marks: 2,
                        answer: " "
                    }
                }
            },
            b:{

            }
        }
    }
}
*/

/**
 *const exampleMCQQuestion = {
  topics: [] //this will be an array of topic IDs
  intro: [
    {
      isText: true,
      text: "",
    },
    {
      isText: false,
      imgUrl: "",
    },
  ],
  options: [
    { isText: true, optionNumber: 1, text: "..." },
    { isText: false, imgUrl: "" },
  ],
};
 *
 */

/**
// If there are no sub question parts, database will have null value
// To be decided if I want to add
const questionParts = [
    {
        part: "a", 
        subpart: ["i", "ii", "..."]
    }, 
    {
        part: "b"
    } 
] 
*/
