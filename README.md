# Sudoku solver and explainer

Hi there. This little project used to be just a simple CLI tool that I wrote in Ruby while being a
student. I recently ported it to work on web instead, so
[here](https://torarvid.github.io/sudoku-explainer/) it is.

The user can set a sudoku board to look like they want, and then press the "Solve a step" button to
make Ze Brainz do its thing. When it does, it tries to explain what's happening below the Sudoku
board.

Behind the curtains, it works by running a set of algorithms against to either place a number in a
cell directly, or to reduce the "helper numbers" for a number of cells.
