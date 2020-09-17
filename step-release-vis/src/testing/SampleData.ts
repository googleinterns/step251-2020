/*
 * Copyright 2020 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

import {Polygon} from '../app/models/Polygon';

export class SampleData {
  envMin = 1591119200;
  envMax = 1598399200;

  project = {
    name: 'project',
    envsList: [
      {
        name: 'test',
        snapshotsList: [
          {
            timestamp: {
              seconds: 1591119200,
              nanos: 0,
            },
            candidatesList: [
              {
                candidate: '1',
                jobCount: 100,
              },
              {
                candidate: '2',
                jobCount: 700,
              },
              {
                candidate: '3',
                jobCount: 1200,
              },
            ],
          },
          {
            timestamp: {
              seconds: 1591619200,
              nanos: 0,
            },
            candidatesList: [
              {
                candidate: '1',
                jobCount: 100,
              },
              {
                candidate: '2',
                jobCount: 1000,
              },
              {
                candidate: '3',
                jobCount: 900,
              },
            ],
          },
          {
            timestamp: {
              seconds: 1598019200,
              nanos: 0,
            },
            candidatesList: [
              {
                candidate: '1',
                jobCount: 1000,
              },
              {
                candidate: '2',
                jobCount: 1000,
              },
            ],
          },
          {
            timestamp: {
              seconds: 1598399200,
              nanos: 0,
            },
            candidatesList: [
              {
                candidate: '2',
                jobCount: 2000,
              },
            ],
          },
        ],
      },
    ],
    candidatesList: [],
  };

  projectProto = `
  "project",
    [
      "test",
      [
        [
          [
            1591119200,
            0
          ],
          [
            [
              "1",
              100
            ],
            [
              "2",
              700
            ],
            [
              "3",
              1200
            ]
          ]
        ],
        [
          [
            1591619200,
            0
          ],
          [
            [
              "1",
              100
            ],
            [
              "2",
              1000
            ],
            [
              "3",
              900
            ]
          ]
        ],
        [
          [
            1598019200,
            0
          ],
          [
            [
              "1",
              1000
            ],
            [
              "2",
              1000
            ],
          ]
        ],
        [
          [
            1598399200,
            0
          ],
          [
            [
              "2",
              2000
            ]
          ]
        ],
      ]
    ],
  []`;

  testCandName = 'test_cand_name';
  polygons: Polygon[] = [
    new Polygon(
      [
        {x: 1591119200, y: 0},
        {x: 1591119200, y: 100},
        {x: 1591619200, y: 0},
      ],
      this.testCandName
    ),
    new Polygon(
      [
        {x: 1591119200, y: 100},
        {x: 1591619200, y: 100},
        {x: 1591619200, y: 0},
      ],
      this.testCandName
    ),
    new Polygon(
      [
        {x: 1591619200, y: 0},
        {x: 1591619200, y: 100},
        {x: 1591619200, y: 0},
      ],
      this.testCandName
    ),
    new Polygon(
      [
        {x: 1591619200, y: 100},
        {x: 1591619200, y: 100},
        {x: 1591619200, y: 0},
      ],
      this.testCandName
    ),
    new Polygon(
      [
        {x: 1591619200, y: 0},
        {x: 1591619200, y: 100},
        {x: 1598019200, y: 0},
      ],
      this.testCandName
    ),
    new Polygon(
      [
        {x: 1591619200, y: 100},
        {x: 1598019200, y: 100},
        {x: 1598019200, y: 0},
      ],
      this.testCandName
    ),
    new Polygon(
      [
        {x: 1598019200, y: 0},
        {x: 1598019200, y: 100},
        {x: 1598399200, y: 0},
      ],
      this.testCandName
    ),
    new Polygon(
      [
        {x: 1598019200, y: 100},
        {x: 1598399200, y: 100},
        {x: 1598399200, y: 0},
      ],
      this.testCandName
    ),
  ];

  getPolygons(): Polygon[] {
    return this.polygons;
  }
}
