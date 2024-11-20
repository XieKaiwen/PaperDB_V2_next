import prisma from "../utils/prisma-client/client";
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

const DATA_FOLDER_ROUTE = path.join(__dirname, "../src/data/"); // Use __dirname to get the absolute path

interface CsvData {
  [key: string]: string;
}

interface TableConfig {
  fileName: string;
  model: any;
  dataTransform?: (data: CsvData) => any;
}

const tableConfigs: TableConfig[] = [
  {
    fileName: 'sample_schools.csv',
    model: prisma.school,
    dataTransform: (data) => ({
      id: data.id,
      schoolType: data.schoolType,
      schoolFullName: data.schoolFullName,
      schoolShortName: data.schoolShortName,
    }),
  },
  {
    fileName: 'sample_subjects.csv',
    model: prisma.subject,
    dataTransform: (data) => ({
      id: data.id,
      subjectName: data.subjectName,
      educationLevels: JSON.parse(data.educationLevels.replace(/""/g, '"')),
    }),
  },
  {
    fileName: 'sample_topic.csv',
    model: prisma.topic,
    dataTransform: (data) => ({
      id: data.id,
      topicName: data.topicName,
      subjectId: data.subjectId,
      educationLevel: data.educationLevel,
    }),
  }
];

function readCsvFile(filePath: string): CsvData[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
}

async function seedTable(config: TableConfig) {
  const filePath = path.join(DATA_FOLDER_ROUTE, config.fileName); // Correct the path here
  const data = readCsvFile(filePath);

  for (const item of data) {
    const transformedData = config.dataTransform ? config.dataTransform(item) : item;
    await config.model.create({ data: transformedData });
  }

  console.log(`${config.model.name} seeded successfully`);
}

async function main() {
  for (const config of tableConfigs) {
    await seedTable(config);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
