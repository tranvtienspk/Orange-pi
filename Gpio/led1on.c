#include <wiringPi.h>
int main (void)
{
  wiringPiSetup () ;
  pinMode (8, OUTPUT) ;
  digitalWrite (8,  LOW) ; delay (10) ;  
  return 0 ;
}