Dec/09/18
Issue:
    There is a bug in the code. 
    when we try to create a new tab, it will destroy the current table tab since 
    we allow user to see change on the table right away while they try to play/put different number of row and column.
    for that reason, we keep the coordinate   
            th1 = h1; //keep the original table row and column for redraw
            th2 = h2;
            tv1 = v1;
            tv2 = v2;
    of horizontal start and end and verticle start and end of the current table tab
    to a variable. after user click submit to create a new tab, the new table will create with the new 
    rows and columns user just created, and the previous coordinate will be regenerated to the previous table tab.
    So, when we delete the last tab, the tab table content before that last tab just deleted will be regenerated
    to the last tab table content that just delete when we try to create a new one with submit button.
    
    
Tab 1
	-2	-1	0	1       
0	0	0	0	0
1	-2	-1	0	1
2	-4	-2	0	2

Tab 2 (delete this tab)
	-2	-1	0	1	2	3
0	0	0	0	0	0	0
1	-2	-1	0	1	2	3
2	-4	-2	0	2	4	6
3	-6	-3	0	3	6	9

delete tab 2 when try to create a new tab 
Tab 1 table will become the deleted tab 

Tab 1 (tab 1 become the deleted tab 2)
	-2	-1	0	1	2	3
0	0	0	0	0	0	0
1	-2	-1	0	1	2	3
2	-4	-2	0	2	4	6
3	-6	-3	0	3	6	9

Tab 2 (New)

	-1	0	1	2
0	0	0	0	0
1	-1	0	1	2
2	-2	0	2	4

solution: 
    keep an array of all table coordinate, keep track of which tab is deleted,
    and delete its coordinate in the array. regenerated the table with the 
    coordinate of the last element of array generateTable(A[A.length - 1]);