//
//  main.c
//  NChancellors
//
//  Created by JJ Sinang on 11/4/15.
//  Copyright (c) 2015 MacBook Pro. All rights reserved.
//

#include <stdio.h>
#define TRUE 1
#define FALSE 0

void print_solution(int n,int x[]) {
    int i,j;
    int solution[n+1][n+1];
    // pre-fill with dashes
    for(i=1;i<=n;i++) {
        for(j=1; j<=n; j++) {
            solution[i][j]='-';
        }
    }
    
    // fill solutions
    for(i=1;i<=n;i++) {
        solution[i][x[i]]='C';
    }
    
    // print table
    for( i=1;i<=n;i++) {
        for(j=1;j<=n;j++) {
            printf("\t%c",solution[i][j]);
        }
        printf("\n");
    }
}


int place(int x[],int k) {
    int i;
    for(i=1;i<k;i++) { // compare against previous answers

        if (x[i]==x[k]) { // if same column
            return FALSE;
        }

        if (i-x[i]==k-x[k]) { // if same back-diagonal
            //return FALSE;
        }

        if (i+x[i]==k+x[k]) { // if same forward-diagonal
            //return FALSE;
        }
        // knight moves
        if (i==k-1 && x[i]==x[k]-2) { // col-2, row-1
            return FALSE;
        }
        if (i==k+1 && x[i]==x[k]-2) { // col-2, row+1
            return FALSE;
        }
        if (i==k-1 && x[i]==x[k]+2) { // col+2, row-1
            return FALSE;
        }
        if (i==k+1 && x[i]==x[k]+2) { // col+2, row+1
            return FALSE;
        }
        if (i==k-2 && x[i]==x[k]-1) { // col-1, row-2
            return FALSE;
        }
        if (i==k+2 && x[i]==x[k]-1) { // col-1, row+2
            return FALSE;
        }
        if (i==k-2 && x[i]==x[k]+1) { // col+1, row-2
            return FALSE;
        }
        if (i==k+2 && x[i]==x[k]+1) { // col+1, row+2
            return FALSE;
        }
    }

    return TRUE;
}

void nchancellors(int n, int initial[]) {
    int x[n+1]; // queen positions: row=index, column=value
    int count=0;
    int k=1;

    x[k]=0;
    
    while(k!=0) {
        x[k]=x[k]+1;
        while((x[k]<=n)&&(!place(x,k))) { // try each column to place queen
            x[k]=x[k]+1; // if cannot be placed in column x[k], try next column (x[k]+1)
        }
        if(x[k]<=n) {
            if(k==n) { // n queens have been placed
                int i, hasInitialSolution = TRUE;
                for (i=1; i<=n; i++) {
                    if (initial[i]>0 && initial[i]!=x[i]) {
                        hasInitialSolution = FALSE;
                    }
                }
                if (hasInitialSolution) {
                    count++;
                    printf("\n\tSolution %d: \n",count);
                    print_solution(n,x);
                }
            } else { // next queen
                k++;
                x[k]=0;
            }
        } else { // lumampas na; backtrack!
            k--;
        }
    }

    if (count==0) {
        printf("\n\tPuzzle has no solutions\n");
    }
    return;
}

int main(int argc, const char * argv[]) {

    FILE *fp;
    fp = fopen("/Users/MacBook/git/NChancellors/NChancellors/input.txt", "r"); // change this

    int i, n, row=1, col=1, val;
    fscanf(fp,"%d",&n);
    int initial[n+1];
    for (i=1; i<=n; i++) {
        initial[i] = 0;
    }

    while(fscanf(fp, "%d", &val) != EOF){
        if (val==1) {
            initial[row] = col;
        }
        if(col > n-1){
            row++;
            col = 0;
        }
        col++;
    }
    
    fclose(fp);

/*    printf("\n%i - ",n);
    for (i=1; i<=n; i++) {
        printf("%i ",initial[i]);
    }printf("\n");*/

    printf("\n\n\t\t\t %d-CHANCELLOR'S STRATEGY \n\n",n);
    nchancellors(n, initial);
    return 0;
}
