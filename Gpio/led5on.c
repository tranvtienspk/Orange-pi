#include <wiringPi.h>
int main (void)
{
  wiringPiSetup () ;
  pinMode (2, OUTPUT) ;
  digitalWrite (2,  LOW) ; delay (10) ;  
  return 0 ;
}