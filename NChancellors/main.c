//
//  main.c
//  NChancellors
//
//  Created by JJ Sinang on 11/4/15.
//  crlsctalan23@gmail.com - carlos catalan
//  Copyright (c) 2015 MacBook Pro. All rights reserved.
//

#include <stdio.h>
#define N 8
#define TRUE 1
#define FALSE 0

void print_solution(int n,int x[]) {
    char c[N+1][N+1];
    int i,j;
    
    // pre-fill with dashes
    for(i=1;i<=n;i++) {
        for(j=1; j<=n; j++) {
            c[i][j]='-';
        }
    }
    
    // fill solutions
    for(i=1;i<=n;i++) {
        c[i][x[i]]='Q';
    }
    
    // print table
    for( i=1;i<=n;i++) {
        for(j=1;j<=n;j++) {
            printf("\t%c",c[i][j]);
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
            return FALSE;
        }

        if (i+x[i]==k+x[k]) { // if same forward-diagonal
            return FALSE;
        }

        // knight moves - (col+-2 && row+-1) || (col+-1 && row+-2)
        if(i-x[i]==k-x[k]) {
            return FALSE;
        }
    }
    return TRUE;
}

void nqueens(int n) {
    int x[N+1]; // queen positions: row=index, column=value
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
                count++;
                printf("\n\tSolution %d  is : \n\n\n",count);
                print_solution(n,x);
            } else { // next queen
                k++;
                x[k]=0;
            }
        } else { // lumampas na; backtrack!
            k--;
        }
    }
    return;
}

int main(int argc, const char * argv[]) {
    // insert code here...
    //int n;
    //printf("\n Enter the no. of Queens : ");
    //scanf("%d",&n);
    printf("\n\n\t\t\t USING %d QUEEN'S STRATEGY \n\n",N);
    nqueens(N);
    return 0;
}
