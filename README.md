_Tick Tack Toe - Problem identification_
Create a game whereby users can take turns in a browser against a machine to play tick tack toe
Game logic - user goes first and is assigned an x or a O and places it on the board
Then the computer goes and this continues until all spaces are full or somebody has three in a row.

_MVP simplification_
We will start this as a console based game using co-ordinates till all of the logic is solved and it works.
We need to use FP design, which includes a gameboard object (stores current win/loss state and game board state) and player objects (each have the ability to place at co-ordinate only and have a variable for win / loss)

_Gameboard object_
Need to create the co-ordinate system using an object with 3 rows and 3 columns (each column has a row) and initialize it.

logic for a 3-cross
if current index in middle horizontal (1,4,7) ->
if both sides are same marker (index +- 1) then player wins

if current index is in middle vertical ()

if current index is at end (2,5,8) -> if previous 2 indexes are same marker then player wins
if current index is at beginning (0,3,6) -> if next 2 indexes are same marker then player wins

index 0:
if index +1 and index - 1 (left and right)

if index + 1 and index + 2 (next two right)
if index + 3 and index + 6 (next two down)
if index + 4 and index + 8 (diagonal)

perspective of objective board (X) marker:
if any three indexes in a row are the same (0,1,2) i +1 +1 (x3 -> 0,3,6)
if any three indexes in a vertical are the same () i +3 +3 (x3 -> 0,1,2)
if any three indexes are diagonal (0,4,8)
