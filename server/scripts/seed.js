'use strict';

const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User.model');
const Program = require('../models/Program.model');
const Level = require('../models/Level.model');
const Vocabulary = require('../models/Vocabulary.model');

const seedData = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    // 1. Clear existing test data
    await Promise.all([
      User.deleteMany({}),
      Program.deleteMany({}),
      Level.deleteMany({}),
      Vocabulary.deleteMany({}),
    ]);
    console.log('[Seed] Cleared collections');

    // 2. Create Users
    const adminUser = await User.create({
      username: 'Admin Master',
      email: 'admin@english.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    const regularUser = await User.create({
      username: 'Sophea Learner',
      email: 'user@english.com',
      password: 'user123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    });

    console.log(`[Seed] Created users: ${adminUser.email} (Admin), ${regularUser.email} (User)`);

    // 3. Create Programs
    const generalEnglish = await Program.create({
      name: 'General English (CEFR)',
      slug: 'general-english',
      description: 'Comprehensive English curriculum covering grammar, vocabulary, listening, and speaking from beginner to advanced.',
      icon: 'lucide:book-open',
      order: 1,
      isActive: true,
    });

    const ieltsPrep = await Program.create({
      name: 'IELTS Academic Mastery',
      slug: 'ielts-mastery',
      description: 'Intensive preparation program focused on high-yield vocabulary, formal writing, and speaking strategies for IELTS 7.0+.',
      icon: 'lucide:award',
      order: 2,
      isActive: true,
    });

    const businessEnglish = await Program.create({
      name: 'Business English & Career',
      slug: 'business-english',
      description: 'Professional communication, presentations, business meetings, negotiation vocabulary, and formal email writing.',
      icon: 'lucide:briefcase',
      order: 3,
      isActive: true,
    });

    console.log('[Seed] Created programs');

    // 4. Create Levels
    const levelsData = [
      // General English levels
      { programId: generalEnglish._id, code: 'A1', name: 'Starter / Beginner', description: 'Basic greetings, everyday nouns, and simple sentence structures.', order: 1 },
      { programId: generalEnglish._id, code: 'A2', name: 'Elementary', description: 'Routine communication on familiar matters and social exchanges.', order: 2 },
      { programId: generalEnglish._id, code: 'B1', name: 'Pre-Intermediate', description: 'Understand key points of clear standard input on familiar topics.', order: 3 },
      { programId: generalEnglish._id, code: 'B2', name: 'Upper Intermediate', description: 'Spontaneous fluency, complex text comprehension, and abstract topics.', order: 4 },
      { programId: generalEnglish._id, code: 'C1', name: 'Advanced English', description: 'Fluent and effortless expression, complex organizational patterns.', order: 5 },

      // IELTS levels
      { programId: ieltsPrep._id, code: 'BAND-5', name: 'Foundation (Target 5.5 - 6.0)', description: 'Essential vocabulary building and basic essay structure.', order: 1 },
      { programId: ieltsPrep._id, code: 'BAND-7', name: 'Advanced (Target 7.0 - 8.5)', description: 'Lexical resource, complex idioms, academic collocations, and coherence.', order: 2 },

      // Business English levels
      { programId: businessEnglish._id, code: 'BUS-1', name: 'Workplace Essentials', description: 'Office communication, basic correspondence, and telephone English.', order: 1 },
      { programId: businessEnglish._id, code: 'BUS-2', name: 'Executive Leadership', description: 'Corporate negotiations, pitching, and global conference discussions.', order: 2 },
    ];

    await Level.insertMany(levelsData);
    console.log('[Seed] Created program levels');

    // 5. Create Rich Vocabulary with Khmer translations
    const vocabularyData = [
      {
        language: 'english',
        word: 'abandon',
        pronunciation: '/əˈbændən/',
        difficulty: 'medium',
        tags: ['academic', 'verbs', 'ielts'],
        topics: ['Daily Life', 'Decisions'],
        noteKhmer: 'កិរិយាស័ព្ទនេះប្រើជាទូទៅក្នុងន័យបោះបង់ចោលកិច្ចការ ឬរបស់របរដោយគ្មានបំណងត្រឡប់មកវិញ។',
        isVerified: true,
        meanings: [
          {
            partOfSpeech: 'verb',
            khmerMeaning: 'បោះបង់ចោល, លះបង់ចោល',
            structures: ['abandon something', 'abandon doing something'],
            usageKhmer: 'ប្រើនៅពេលនរណាម្នាក់សម្រេចចិត្តឈប់ធ្វើ ឬឈប់ថែរក្សាអ្វីមួយទាំងស្រុង។',
            examples: [
              {
                english: 'They had to abandon their car in the heavy snowstorm.',
                khmer: 'ពួកគេត្រូវបង្ខំចិត្តបោះបង់រថយន្តរបស់ពួកគេចោលនៅក្នុងព្យុះព្រិលដ៏ខ្លាំង។',
                structure: 'abandon + noun',
                vocabularyNotes: ['snowstorm = ព្យុះព្រិល']
              },
              {
                english: 'The researchers abandoned the experiment due to lack of funding.',
                khmer: 'ក្រុមអ្នកស្រាវជ្រាវបានបោះបង់ចោលការពិសោធន៍ដោយសារកង្វះខាតថវិកា។',
                structure: 'abandon + object + prepositional phrase',
                vocabularyNotes: ['funding = មូលនិធិ / ថវិកា']
              }
            ],
            collocations: [
              {
                phrase: 'abandon hope',
                khmerMeaning: 'អស់សង្ឃឹម, បោះបង់ក្តីសង្ឃឹម',
                example: 'Never abandon hope even in the darkest hours.',
                exampleKhmer: 'កុំបោះបង់ក្តីសង្ឃឹមឱ្យសោះ ទោះបីនៅក្នុងកាលៈទេសៈលំបាកបំផុតក៏ដោយ។'
              },
              {
                phrase: 'abandon a project',
                khmerMeaning: 'បោះបង់គម្រោងចោល',
                example: 'The company decided to abandon the project.',
                exampleKhmer: 'ក្រុមហ៊ុនបានសម្រេចចិត្តបោះបង់គម្រោងនេះចោល។'
              }
            ],
            order: 0
          }
        ],
        synonyms: [
          { word: 'desert', khmerMeaning: 'រត់ចោល, បោះបង់ចោល', differenceKhmer: 'desert បង្កប់ន័យអវិជ្ជមានខ្លាំងជាង ដូចជាការក្បត់កាតព្វកិច្ច' },
          { word: 'forsake', khmerMeaning: 'លះបង់ចោល (ពាក្យអក្សរសាស្ត្រ)', differenceKhmer: 'ប្រើក្នុងបរិបទអក្សរសាស្ត្រ ឬមនោសញ្ចេតនា' }
        ],
        antonyms: [
          { word: 'retain', khmerMeaning: 'រក្សាទុក' },
          { word: 'maintain', khmerMeaning: 'ថែរក្សា' },
          { word: 'continue', khmerMeaning: 'បន្ត' }
        ],
        relatedWords: [
          { word: 'abandonment', khmerMeaning: 'ការបោះបង់ចោល', relationship: 'noun form' }
        ],
        phrasalVerbs: [],
        idioms: []
      },
      {
        language: 'english',
        word: 'resilient',
        pronunciation: '/rɪˈzɪliənt/',
        difficulty: 'hard',
        tags: ['personality', 'psychology', 'advanced', 'ielts'],
        topics: ['Personal Growth', 'Success', 'Health'],
        noteKhmer: 'ពាក្យដ៏ពេញនិយមក្នុងវិញ្ញាសា IELTS ពិពណ៌នាអំពីភាពរឹងមាំខាងផ្លូវចិត្ត និងសមត្ថភាពងើបឡើងវិញក្រោយការបរាជ័យ។',
        isVerified: true,
        meanings: [
          {
            partOfSpeech: 'adjective',
            khmerMeaning: 'ដែលធន់, ដែលមានភាពរឹងមាំអាចងើបឡើងវិញបានឆាប់រហ័ស',
            structures: ['resilient to something', 'highly resilient'],
            usageKhmer: 'ប្រើសម្រាប់មនុស្ស ឬសេដ្ឋកិច្ចដែលមិនងាយដួលរលំនៅចំពោះមុខឧបសគ្គ។',
            examples: [
              {
                english: 'Children are remarkably resilient and adapt to changes quickly.',
                khmer: 'កុមារមានភាពធន់គួរឱ្យកត់សម្គាល់ និងសម្របខ្លួនទៅនឹងការផ្លាស់ប្តូរបានយ៉ាងរហ័ស។',
                structure: 'subject + be + resilient',
                vocabularyNotes: ['remarkably = គួរឱ្យកត់សម្គាល់']
              },
              {
                english: 'The local economy proved resilient despite the global crisis.',
                khmer: 'សេដ្ឋកិច្ចក្នុងស្រុកបានបង្ហាញពីភាពធន់ បើទោះបីជាមានវិបត្តិសកលលោកក៏ដោយ។',
                structure: 'prove + resilient',
                vocabularyNotes: ['crisis = វិបត្តិ']
              }
            ],
            collocations: [
              {
                phrase: 'resilient spirit',
                khmerMeaning: 'ស្មារតីរឹងមាំអង់អាច',
                example: 'Her resilient spirit inspired everyone around her.',
                exampleKhmer: 'ស្មារតីរឹងមាំរបស់នាងបានបំផុសគំនិតមនុស្សគ្រប់គ្នានៅជុំវិញនាង។'
              }
            ],
            order: 0
          }
        ],
        synonyms: [
          { word: 'tough', khmerMeaning: 'ស្វិតស្វាញ, រឹងមាំ', differenceKhmer: 'tough ប្រើទូទៅ resilient ផ្ដោតលើការងើបឡើងវិញ' },
          { word: 'adaptable', khmerMeaning: 'ងាយសម្របខ្លួន', differenceKhmer: 'adaptable សង្កត់ធ្ងន់លើការបត់បែន' }
        ],
        antonyms: [
          { word: 'fragile', khmerMeaning: 'ផុយស្រួយ' },
          { word: 'vulnerable', khmerMeaning: 'ងាយរងគ្រោះ' }
        ],
        relatedWords: [
          { word: 'resilience', khmerMeaning: 'ភាពធន់, ភាពរឹងមាំ', relationship: 'noun form' }
        ],
        phrasalVerbs: [
          {
            phrase: 'bounce back',
            khmerMeaning: 'ងើបឡើងវិញយ៉ាងលឿន',
            example: 'He bounced back quickly after the defeat.',
            exampleKhmer: 'គាត់បានងើបឡើងវិញយ៉ាងឆាប់រហ័សបន្ទាប់ពីការបរាជ័យ។'
          }
        ],
        idioms: []
      },
      {
        language: 'english',
        word: 'procrastinate',
        pronunciation: '/prəʊˈkræstɪneɪt/',
        difficulty: 'medium',
        tags: ['habits', 'productivity', 'verbs'],
        topics: ['Work', 'Study Habits'],
        noteKhmer: 'ទម្លាប់ពន្យារពេល ឬផ្អាកការងារដែលត្រូវធ្វើ ទៅធ្វើកិច្ចការមិនសូវសំខាន់វិញ។',
        isVerified: true,
        meanings: [
          {
            partOfSpeech: 'verb',
            khmerMeaning: 'ពន្យារពេល, ទម្លាប់ចាំស្អែក, ក្រអែក្រអូប',
            structures: ['procrastinate on something', 'stop procrastinating'],
            usageKhmer: 'ប្រើនៅពេលនរណាម្នាក់ពន្យារពេលមិនព្រមធ្វើកិច្ចការបន្ទាន់។',
            examples: [
              {
                english: 'I always procrastinate when I have a difficult essay to write.',
                khmer: 'ខ្ញុំតែងតែពន្យារពេលនៅពេលដែលខ្ញុំមានអត្ថបទតែងសេចក្តីពិបាកត្រូវសរសេរ។',
                structure: 'procrastinate + clause',
                vocabularyNotes: ['essay = អត្ថបទតែងសេចក្តី']
              }
            ],
            collocations: [
              {
                phrase: 'tendency to procrastinate',
                khmerMeaning: 'ទំនោរក្នុងការចាំស្អែក',
                example: 'She overcame her tendency to procrastinate.',
                exampleKhmer: 'នាងបានយកឈ្នះទំនោរពន្យារពេលរបស់នាង។'
              }
            ],
            order: 0
          }
        ],
        synonyms: [
          { word: 'delay', khmerMeaning: 'ពន្យារ', differenceKhmer: 'delay អាចមកពីហេតុផលបច្ចេកទេស ឯ procrastinate មកពីចិត្តខ្ជិល' },
          { word: 'postpone', khmerMeaning: 'លើកពេល', differenceKhmer: 'postpone គឺជាការលើកពេលផ្លូវការ' }
        ],
        antonyms: [
          { word: 'expedite', khmerMeaning: 'ពន្លឿន' },
          { word: 'execute', khmerMeaning: 'អនុវត្តភ្លាមៗ' }
        ],
        relatedWords: [
          { word: 'procrastination', khmerMeaning: 'ទម្លាប់ពន្យារពេល', relationship: 'noun' },
          { word: 'procrastinator', khmerMeaning: 'មនុស្សចូលចិត្តចាំស្អែក', relationship: 'noun (person)' }
        ],
        phrasalVerbs: [
          {
            phrase: 'put off',
            khmerMeaning: 'ពន្យារពេល',
            example: 'Don’t put off until tomorrow what you can do today.',
            exampleKhmer: 'កុំពន្យារពេលដល់ថ្ងៃស្អែក នូវអ្វីដែលអ្នកអាចធ្វើបាននៅថ្ងៃនេះ។'
          }
        ],
        idioms: []
      },
      {
        language: 'english',
        word: 'eloquent',
        pronunciation: '/ˈeləkwənt/',
        difficulty: 'hard',
        tags: ['communication', 'public speaking', 'advanced'],
        topics: ['Communication', 'Literature'],
        noteKhmer: 'សមត្ថភាពបញ្ចេញវោហាស័ព្ទយ៉ាងរលូន ច្បាស់លាស់ និងមានអានុភាពបញ្ចុះបញ្ចូល។',
        isVerified: true,
        meanings: [
          {
            partOfSpeech: 'adjective',
            khmerMeaning: 'មានវោហាស័ព្ទពូកែ, និយាយក្បោះក្បាយគួរឱ្យចាប់អារម្មណ៍',
            structures: ['an eloquent speaker', 'eloquent speech'],
            usageKhmer: 'ប្រើសម្រាប់សរសើរសុន្ទរកថា ឬអ្នកនិយាយដែលមានភាពប៉ិនប្រសប់។',
            examples: [
              {
                english: 'The prime minister delivered an eloquent speech defending human rights.',
                khmer: 'នាយករដ្ឋមន្ត្រីបានថ្លែងសុន្ទរកថាដ៏ប៉ិនប្រសប់ក្បោះក្បាយដើម្បីការពារសិទ្ធិមនុស្ស។',
                structure: 'deliver an eloquent speech',
                vocabularyNotes: ['defend = ការពារ']
              }
            ],
            collocations: [
              {
                phrase: 'eloquent expression',
                khmerMeaning: 'ការបង្ហាញអារម្មណ៍យ៉ាងក្បោះក្បាយ',
                example: 'Her eyes gave an eloquent expression of gratitude.',
                exampleKhmer: 'កែវភ្នែករបស់នាងបានបង្ហាញពីការដឹងគុណយ៉ាងជ្រាលជ្រៅ។'
              }
            ],
            order: 0
          }
        ],
        synonyms: [
          { word: 'articulate', khmerMeaning: 'ច្បាស់លាស់ក្បោះក្បាយ', differenceKhmer: 'articulate ផ្ដោតលើភាពច្បាស់លាស់ eloquent ផ្ដោតលើភាពទាក់ទាញផ្លូវចិត្ត' },
          { word: 'fluent', khmerMeaning: 'ស្ទាត់ជំនាញ', differenceKhmer: 'fluent សំដៅលើភាពរលូន' }
        ],
        antonyms: [
          { word: 'inarticulate', khmerMeaning: 'និយាយមិនក្បោះក្បាយ, ពិបាកយល់' }
        ],
        relatedWords: [
          { word: 'eloquence', khmerMeaning: 'វោហាស័ព្ទ, វោហារសាស្ត្រ', relationship: 'noun' }
        ],
        phrasalVerbs: [],
        idioms: [
          {
            phrase: 'silver tongue',
            khmerMeaning: 'អណ្ដាតមាស (ពូកែនិយាយបញ្ចុះបញ្ចូល)',
            example: 'His silver tongue helped him win the debate.',
            exampleKhmer: 'វោហាស័ព្ទដ៏ពូកែរបស់គាត់បានជួយឱ្យគាត់ឈ្នះការតវ៉ាដេញដោល។'
          }
        ]
      },
      {
        language: 'english',
        word: 'achieve',
        pronunciation: '/əˈtʃiːv/',
        difficulty: 'easy',
        tags: ['goals', 'success', 'core'],
        topics: ['Daily Life', 'Career'],
        noteKhmer: 'កិរិយាស័ព្ទមូលដ្ឋានដែលត្រូវជួបប្រទះញឹកញាប់បំផុតនៅក្នុងការសិក្សាភាសាអង់គ្លេស។',
        isVerified: true,
        meanings: [
          {
            partOfSpeech: 'verb',
            khmerMeaning: 'សម្រេចបាន, ទទួលជោគជ័យ',
            structures: ['achieve a goal', 'achieve success'],
            usageKhmer: 'ប្រើនៅពេលធ្វើអ្វីមួយបានសម្រេចដោយការប្រឹងប្រែង។',
            examples: [
              {
                english: 'With dedication and hard work, you can achieve your dreams.',
                khmer: 'ដោយការលះបង់ និងការខិតខំប្រឹងប្រែង អ្នកអាចសម្រេចក្តីសុបិនរបស់អ្នកបាន។',
                structure: 'achieve + noun phrase',
                vocabularyNotes: ['dedication = ការលះបង់']
              }
            ],
            collocations: [
              {
                phrase: 'achieve a milestone',
                khmerMeaning: 'សម្រេចបានដំណាក់កាលសំខាន់មួយ',
                example: 'We achieved a major milestone this month.',
                exampleKhmer: 'យើងសម្រេចបាននូវដំណាក់កាលសំខាន់មួយក្នុងខែនេះ។'
              }
            ],
            order: 0
          }
        ],
        synonyms: [
          { word: 'accomplish', khmerMeaning: 'បំពេញបានសម្រេច', differenceKhmer: 'accomplish ប្រើចំពោះការងារដែលបានបញ្ចប់រួចរាល់' },
          { word: 'attain', khmerMeaning: 'ឈានដល់ (គោលដៅខ្ពស់)', differenceKhmer: 'attain ប្រើក្នុងភាសាផ្លូវការ' }
        ],
        antonyms: [
          { word: 'fail', khmerMeaning: 'បរាជ័យ' }
        ],
        relatedWords: [
          { word: 'achievement', khmerMeaning: 'សមិទ្ធផល, ជោគជ័យ', relationship: 'noun' }
        ],
        phrasalVerbs: [],
        idioms: []
      }
    ];

    await Vocabulary.insertMany(vocabularyData);
    console.log(`[Seed] Seeded ${vocabularyData.length} rich English-Khmer vocabulary entries`);

    console.log('[Seed] Database seeding completed successfully! ✨');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

