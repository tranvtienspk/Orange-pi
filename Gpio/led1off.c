#include <wiringPi.h>
int main (void)
{
  wiringPiSetup () ;
  pinMode (8, OUTPUT) ;
  digitalWrite (8,  HIGH) ; delay (10) ;  
  return 0 ;
}