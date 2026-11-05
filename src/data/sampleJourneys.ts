/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JourneyTemplate } from '../types';

export const SAMPLE_JOURNEYS: JourneyTemplate[] = [
  {
    id: 'mina',
    name: 'Mina',
    persona: 'Cohort 7, 2nd Semester',
    tagline: 'Stacked deadlines & sleeplessness',
    description:
      'Three major studio assignments are due in the exact same week. She went to office hours once and said she was struggling, but nothing changed. She needs a formal letter on record.',
    initialPrompt:
      "Hi. I'm in my second semester of MDes Cohort 7. I really need to write a formal letter to the program office about the workload. Right now we have three major deliverables all scheduled for the exact same week, and I haven't slept properly in days. I actually went to office hours last week to say I was struggling, but the conversation didn't lead to any change. I want to put this in writing so there is an official record, but my thoughts are messy and I don't want to sound whiny or overly aggressive.",
  },
  {
    id: 'theo',
    name: 'Theo',
    persona: 'Cohort 7, 1st Year',
    tagline: 'Exhausted but doubting himself',
    description:
      'Tired and falling behind, but not sure if his situation is bad enough to complain about. Suspects everyone else is handling it fine and wondering if he should even send a letter.',
    initialPrompt:
      "Hello. I'm in Cohort 7. I think I might need to write a letter to the MDes office, but to be completely honest, I'm not even sure if I should send anything. I am constantly exhausted and falling behind on project milestones, but part of me wonders if I'm just the problem and everyone else is managing fine. Can you help me sort through what's happening first?",
  },
];

export const M_DES_INFO = {
  office: 'MDes Program Office',
  school: 'Master of Design (MDes)',
  institution: 'University of California, Berkeley',
  location: 'Jacobs Hall, 2530 Ridge Road, Berkeley, CA 94720',
  jurisdiction: [
    'Academic calendar & milestone scheduling',
    'Cross-course workload coordination & conflict mitigation',
    'Program requirements & graduation checks',
    'Student academic policy and cohort well-being escalation',
  ],
  notInJurisdiction: [
    'Individual course grades and grading rubrics',
    'Specific pedagogical content taught inside individual electives',
  ],
  suggestedPhrases: [
    'I am writing to raise an urgent concern regarding the current scheduling of cohort deliverables...',
    'I would like to bring the following structural workload challenges to your attention.',
    'This sustained pacing has severely compromised our ability to maintain academic rigor and personal health.',
    'I would appreciate the opportunity to discuss constructive scheduling adjustments with the program leadership.',
    'I would be grateful for an acknowledgement of this letter and a response by [date].',
  ],
};
